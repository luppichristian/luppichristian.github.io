from __future__ import annotations

import datetime as dt
import json
import re
from html import escape
from pathlib import Path
from typing import Any, TypedDict
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parent.parent
SITE_DATA_PATH = ROOT / "assets" / "js" / "data" / "site-data.js"
INDEX_PATH = ROOT / "index.html"
SITEMAP_PATH = ROOT / "sitemap.xml"
API_URL = "https://api.github.com/users/luppichristian/repos?per_page=100"


class Repo(TypedDict):
    name: str
    url: str
    description: str
    language: str | None
    stars: int
    homepage: str
    updated: str


def fetch_repositories() -> list[Repo]:
    request = Request(
        API_URL,
        headers={
            "Accept": "application/vnd.github+json",
            "User-Agent": "luppichristian.github.io-repo-sync",
        },
    )
    with urlopen(request) as response:
        data: list[dict[str, Any]] = json.load(response)

    repos: list[Repo] = []
    for repo in data:
        if repo["fork"]:
            continue
        repos.append(
            {
                "name": repo["name"],
                "url": repo["html_url"],
                "description": repo["description"]
                or fallback_description(repo["name"]),
                "language": repo["language"],
                "stars": repo["stargazers_count"],
                "homepage": repo["homepage"] or "",
                "updated": repo["updated_at"],
            }
        )

    repos.sort(key=lambda item: item["name"].lower())
    return repos


def fallback_description(name: str) -> str:
    if name == "luppichristian":
        return "Profile repository for notes, pinned content, and account-level GitHub presence."
    if name == "luppichristian.github.io":
        return "Source for this portfolio site and search-friendly project directory."
    return "Public GitHub repository by Christian Luppi."


def js_string(value: str) -> str:
    return json.dumps(value, ensure_ascii=True)


def render_repo_data_block(repos: list[Repo]) -> str:
    lines = ["export const REPOSITORIES = ["]
    for index, repo in enumerate(repos):
        lines.extend(
            [
                "  {",
                f"    name: {js_string(repo['name'])},",
                f"    url: {js_string(repo['url'])},",
                f"    description: {js_string(repo['description'])},",
                f"    language: {js_string(repo['language']) if repo['language'] is not None else 'null'},",
                f"    stars: {repo['stars']},",
                f"    homepage: {js_string(repo['homepage'])},",
                f"    updated: {js_string(repo['updated'])}",
                "  }" + ("," if index < len(repos) - 1 else ""),
            ]
        )
    lines.append("];")
    return "\n".join(lines)


def render_repo_schema_items(repos: list[Repo]) -> str:
    sorted_repos = sorted(
        repos, key=lambda item: (-item["stars"], item["name"].lower())
    )
    items = []
    for position, repo in enumerate(sorted_repos, start=1):
        item_lines = [
            "          {",
            '            "@type": "SoftwareSourceCode",',
            f'            "position": {position},',
            f'            "name": {json.dumps(repo["name"], ensure_ascii=True)},',
            f'            "codeRepository": {json.dumps(repo["url"], ensure_ascii=True)},',
        ]
        if repo["language"]:
            item_lines.append(
                f'            "programmingLanguage": {json.dumps(repo["language"], ensure_ascii=True)},'
            )
        item_lines.append(
            f'            "url": {json.dumps(repo["url"], ensure_ascii=True)}'
        )
        item_lines.append("          }")
        items.append("\n".join(item_lines))
    return ",\n".join(items)


def render_repo_list_items(repos: list[Repo]) -> str:
    sorted_repos = sorted(repos, key=lambda item: item["name"].lower())
    lines = []
    for index, repo in enumerate(sorted_repos):
        margin = ' style="margin:0 0 0.5rem;"' if index < len(sorted_repos) - 1 else ""
        lines.append(
            f'          <li{margin}><a href="{escape(str(repo["url"]), quote=True)}">{escape(str(repo["name"]))}</a> - {escape(str(repo["description"]))}</li>'
        )
    return "\n".join(lines)


def replace_between_markers(
    text: str, start_marker: str, end_marker: str, replacement: str
) -> str:
    pattern = re.compile(
        rf"({re.escape(start_marker)}\n)(.*?)(\n\s*{re.escape(end_marker)})",
        re.DOTALL,
    )
    result, count = pattern.subn(rf"\1{replacement}\3", text, count=1)
    if count != 1:
        raise RuntimeError(f"Could not replace block between markers: {start_marker}")
    return result


def update_site_data(repos: list[Repo]) -> None:
    text = SITE_DATA_PATH.read_text(encoding="utf-8")
    pattern = re.compile(r"export const REPOSITORIES = \[.*?\];", re.DOTALL)
    updated = pattern.sub(render_repo_data_block(repos), text, count=1)
    if updated == text:
        raise RuntimeError("Failed to update REPOSITORIES block in site-data.js")
    SITE_DATA_PATH.write_text(updated, encoding="utf-8")


def update_index(repos: list[Repo]) -> None:
    text = INDEX_PATH.read_text(encoding="utf-8")
    schema_pattern = re.compile(
        r'("@id": "https://luppichristian\.github\.io/#github-repositories",\n\s+"name": "Christian Luppi GitHub repositories",\n\s+"numberOfItems": )\d+(,\n\s+"itemListElement": \[\n)(.*?)(\n\s+\])',
        re.DOTALL,
    )
    text, count = schema_pattern.subn(
        lambda match: (
            f"{match.group(1)}{len(repos)}{match.group(2)}{render_repo_schema_items(repos)}{match.group(4)}"
        ),
        text,
        count=1,
    )
    if count != 1:
        raise RuntimeError("Failed to update GitHub repo schema in index.html")
    text = replace_between_markers(
        text,
        "          <!-- AUTO-GENERATED:REPO-LIST:START -->",
        "          <!-- AUTO-GENERATED:REPO-LIST:END -->",
        render_repo_list_items(repos),
    )
    INDEX_PATH.write_text(text, encoding="utf-8")


def update_sitemap_lastmod() -> None:
    today = dt.date.today().isoformat()
    text = SITEMAP_PATH.read_text(encoding="utf-8")
    updated = re.sub(
        r"<lastmod>[^<]+</lastmod>", f"<lastmod>{today}</lastmod>", text, count=1
    )
    SITEMAP_PATH.write_text(updated, encoding="utf-8")


def main() -> None:
    repos = fetch_repositories()
    update_site_data(repos)
    update_index(repos)
    update_sitemap_lastmod()
    print(f"Updated repo catalog with {len(repos)} repositories.")


if __name__ == "__main__":
    main()
