export async function getGitHubStars(): Promise<number | null> {
  try {
    const response = await fetch(
      "https://api.github.com/repos/negarprh/Canadian-Tech-Internships-2027",
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "negar-portfolio",
        },
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(5000),
      },
    );
    if (!response.ok) return null;
    const data = await response.json();
    return typeof data.stargazers_count === "number" &&
      Number.isFinite(data.stargazers_count)
      ? data.stargazers_count
      : null;
  } catch {
    return null;
  }
}
