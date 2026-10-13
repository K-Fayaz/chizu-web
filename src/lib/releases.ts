// The desktop app's downloads, read from the newest *published* release of
// the public K-Fayaz/chizu-releases repo (drafts and pre-releases are
// ignored by GitHub's "latest"). File names carry the version, so links
// can't be hard-coded; the release pipeline (mappy/.github/workflows/
// release.yml) uploads them as Chizu_<v>_x64-setup.exe, Chizu_<v>_amd64.deb
// and Chizu_<v>_amd64.AppImage.

export const RELEASES_REPO = "K-Fayaz/chizu-releases";
export const RELEASES_PAGE = `https://github.com/${RELEASES_REPO}/releases/latest`;
const LATEST_RELEASE_API = `https://api.github.com/repos/${RELEASES_REPO}/releases/latest`;

export type DownloadFile = {
  name: string;
  url: string;
  sizeMb: number;
};

export type LatestRelease = {
  version: string;
  publishedAt: string;
  windows: DownloadFile | null;
  deb: DownloadFile | null;
  appImage: DownloadFile | null;
};

type GitHubAsset = { name: string; browser_download_url: string; size: number };

export function pickDownloads(assets: GitHubAsset[]) {
  const find = (suffix: string): DownloadFile | null => {
    const asset = assets.find((a) => a.name.endsWith(suffix));
    return asset
      ? { name: asset.name, url: asset.browser_download_url, sizeMb: Math.round(asset.size / 1_048_576) }
      : null;
  };
  return {
    windows: find("_x64-setup.exe"),
    deb: find("_amd64.deb"),
    appImage: find("_amd64.AppImage"),
  };
}

// Cached for 5 minutes: a new release shows up on the site within that,
// and GitHub's unauthenticated API limit (60 requests/hour per server IP)
// is never approached. null when there's no published release yet or
// GitHub can't be reached; the page then links to the releases page.
export async function getLatestRelease(): Promise<LatestRelease | null> {
  try {
    const response = await fetch(LATEST_RELEASE_API, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 300 },
    });
    if (!response.ok) return null;
    const release = (await response.json()) as {
      tag_name: string;
      published_at: string;
      assets: GitHubAsset[];
    };
    return {
      version: release.tag_name.replace(/^v/, ""),
      publishedAt: release.published_at,
      ...pickDownloads(release.assets ?? []),
    };
  } catch {
    return null;
  }
}
