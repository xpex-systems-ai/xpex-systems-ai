// Read-only, strict binding between the exact Git commit's successful Vercel
// status and the corresponding Vercel bot preview reported on that PR.
// A comment alone never authorizes a URL; other user comments are ignored.
export function selectVercelBotPreview(sha, commitStatus, comments) {
  if (!/^[a-f0-9]{40}$/.test(sha) || commitStatus?.sha !== sha ||
      commitStatus?.state !== 'success' || !Array.isArray(commitStatus.statuses) ||
      !Array.isArray(comments)) return;
  for (const status of commitStatus.statuses) {
    if (status.context !== 'Vercel' || status.state !== 'success' ||
        typeof status.target_url !== 'string' ||
        !/^https:\/\/vercel\.com\/xpex-neural\/xpex-systems-ai\/[A-Za-z0-9]+$/.test(status.target_url)) continue;
    for (const comment of comments) {
      if (comment?.user?.login !== 'vercel[bot]' || typeof comment.body !== 'string' ||
          comment.body.length > 12000) continue;
      // Use the exact Ready + Preview row tied to the status's inspector URL.
      // The PR's bot row is updated at every official Vercel deployment.
      for (const line of comment.body.split('\n')) {
        if (!line.includes('[Ready](' + status.target_url + ')')) continue;
        const candidate = line.match(/\[Preview\]\((https:\/\/[a-z0-9-]+\.vercel\.app)\)/)?.[1];
        if (!candidate) continue;
        let url;
        try { url = new URL(candidate); } catch { continue; }
        if (url.protocol !== 'https:' || url.origin !== candidate || url.port ||
            url.username || url.password || url.hash || url.search ||
            !/^xpex-systems-(?:[a-z0-9]+|ai-git-[a-z0-9-]+)-xpex-neural\.vercel\.app$/.test(url.hostname)) continue;
        return {url: url.origin, inspectorUrl: status.target_url, provenance: 'vercel-success-status-and-official-pr-bot'};
      }
    }
  }
}
