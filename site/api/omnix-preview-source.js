// Public build provenance only. Never expose a secret, token or environment
// snapshot. Disabled outside the approved Vercel Preview project and branch.
export function previewSourceHandler(req, res, env = process.env) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ok:false,code:'METHOD_DENIED'});
  }
  const commitSha = env.VERCEL_GIT_COMMIT_SHA ?? '';
  if (env.VERCEL !== '1' || env.VERCEL_ENV !== 'preview' ||
      env.VERCEL_PROJECT_ID !== 'prj_9TzNOpz6Uzz34uHfLrlYAXzXcfgw' ||
      env.VERCEL_GIT_PROVIDER !== 'github' ||
      env.VERCEL_GIT_REPO_OWNER !== 'xpex-systems-ai' ||
      env.VERCEL_GIT_REPO_SLUG !== 'xpex-systems-ai' ||
      env.VERCEL_GIT_COMMIT_REF !== 'codex/omnix-product-online-gx019' ||
      !/^[a-f0-9]{40}$/.test(commitSha))
    return res.status(503).json({ok:false,code:'PREVIEW_SOURCE_NOT_ATTESTABLE'});
  return res.status(200).json({ok:true,commitSha,branch:env.VERCEL_GIT_COMMIT_REF,
    environment:'preview',projectId:env.VERCEL_PROJECT_ID,repository:'xpex-systems-ai/xpex-systems-ai'});
}
export default previewSourceHandler;
