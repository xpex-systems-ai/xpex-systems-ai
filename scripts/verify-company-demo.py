#!/usr/bin/env python3
"""Bounded public HTTP observations and an explicitly stateless Factory compilation.

No authentication, customer data, publishing, checkout, signing or payment.
HTTP reachability is recorded separately from the tested Factory workflow.
"""
import concurrent.futures
import datetime
import hashlib
import io
import json
import pathlib
import time
import urllib.error
import urllib.request
import zipfile

ROOT = pathlib.Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'site/public'
FACTORY = 'https://xpex-plugin-factory-production.up.railway.app'
TARGETS = {
    'corporate': 'https://xpex-systems-ai.vercel.app/',
    'systems-command': 'https://xpex-systems-command-staging-web-production.up.railway.app/api/health',
    'audit-os': 'https://gxeon-audit-os.vercel.app/',
    'plugin-factory': FACTORY + '/health',
    'wallet-command': 'https://gxeon-wallet-command-center.vercel.app/',
    'studio-ai': 'https://xpex-studio-ai.vercel.app/',
}

def stamp():
    return datetime.datetime.now(datetime.timezone.utc).isoformat()

def probe(item):
    slug, url = item
    start = time.monotonic()
    result = {'slug': slug, 'url': url, 'observed_at': stamp(), 'method': 'GET', 'scope': 'HTTP_REACHABILITY_ONLY'}
    try:
        request = urllib.request.Request(url, headers={'Accept': 'text/html, application/json'})
        with urllib.request.urlopen(request, timeout=25) as response:
            body = response.read(1024 * 1024)
            result.update(http_status=response.status, final_url=response.url, response_sha256=hashlib.sha256(body).hexdigest(), status='HTTP_RESPONSE_OBSERVED')
    except urllib.error.HTTPError as exc:
        result.update(http_status=exc.code, status='HTTP_ERROR_OBSERVED')
    except Exception:
        result.update(http_status=None, status='UNAVAILABLE')
    result['duration_ms'] = round((time.monotonic() - start) * 1000)
    return result

def post(path, blueprint):
    request = urllib.request.Request(FACTORY + path, json.dumps(blueprint).encode(), headers={'Content-Type':'application/json'}, method='POST')
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            return response.status, response.read(2 * 1024 * 1024)
    except urllib.error.HTTPError as exc:
        return exc.code, exc.read(256 * 1024)

def main():
    observations = list(concurrent.futures.ThreadPoolExecutor(max_workers=6).map(probe, TARGETS.items()))
    blueprint = json.loads((PUBLIC/'company/factory-demo.blueprint.json').read_text())
    tested_at = stamp()
    validate_status, raw = post('/v1/validate', blueprint)
    report = json.loads(raw).get('report', {})
    assert validate_status == 200 and report.get('valid') is True, 'Factory validation failed'
    preview_status, preview_raw = post('/v1/preview', blueprint)
    preview = json.loads(preview_raw)
    assert preview_status == 200 and preview.get('files'), 'Factory preview failed'
    package_status, archive = post('/v1/package', blueprint)
    repeat_status, repeated = post('/v1/package', blueprint)
    assert package_status == repeat_status == 200, 'Factory package failed'
    repeat_identical = archive == repeated
    with zipfile.ZipFile(io.BytesIO(archive)) as z:
        assert z.testzip() is None, 'Invalid ZIP'
        paths = z.namelist()
        assert all(not p.startswith('/') and '..' not in pathlib.PurePosixPath(p).parts for p in paths)
        assert any(p.endswith('plugin.json') for p in paths), 'Missing plugin manifest'
        assert any(p.endswith('mcp.json') for p in paths), 'Missing MCP configuration'
    rejected = json.loads(json.dumps(blueprint))
    rejected['mcpServers'][0]['url'] = 'http://127.0.0.1:8080/mcp'
    rejection_status, rejection_raw = post('/v1/validate', rejected)
    rejection = json.loads(rejection_raw)
    rejection_report = rejection.get('report', {})
    schema_rejected = rejection.get('error') == 'INVALID_BLUEPRINT' and any(
        issue.get('path') == ['mcpServers', 0, 'url'] for issue in rejection.get('issues', []))
    assert rejection_status in (400, 422) and (schema_rejected or rejection_report.get('valid') is False), 'Unsafe endpoint was not blocked'
    (PUBLIC/'company/factory-demo.zip').write_bytes(archive)
    evidence = {
        'schema_version':'1.0', 'observed_at': stamp(), 'public_safe': True,
        'scope':'Public HTTP reachability and stateless Factory validation/preview/package; no external publishing or financial operation.',
        'observations': observations,
        'unobserved_canonical_runtimes': ['api-fabric','academy'],
        'factory_workflow': {
            'tested_at': tested_at, 'corrective_source_commit':'30d31b4d5ce5b31eebf43c0b5a07d360d239f367',
            'source_runtime_commit_correlation':'NOT_VERIFIED',
            'corrective_pr':'https://github.com/xpex-systems-ai/XPeX-Plugin-Factory-/pull/23',
            'production_correction_status':'BEHAVIOR_OBSERVED_SOURCE_CORRELATION_PENDING' if repeat_identical else 'CORRECTION_NOT_OBSERVED',
            'production_access_limit':'The connected Railway account does not expose the Factory project. No unrelated service was redeployed.',
            'validate_http': validate_status, 'preview_http': preview_status, 'package_http': package_status,
            'validation_report': report, 'preview_paths': sorted(preview['files']),
            'zip_paths': paths, 'zip_bytes': len(archive), 'zip_sha256':hashlib.sha256(archive).hexdigest(),
            'repeat_identical': repeat_identical, 'unsafe_endpoint_rejected': True,
            'unsafe_endpoint_http': rejection_status, 'unsafe_endpoint_response': rejection,
            'installed':False, 'published':False, 'payment_executed':False
        },
        'end_to_end_cross_product_workflow':'NOT_TESTED',
        'independent_acceptance':'PENDING'
    }
    for path in [ROOT/'data/company/company-demo-observations-v1.json', PUBLIC/'data/company-demo-observations-v1.json']:
        path.write_text(json.dumps(evidence, ensure_ascii=False, indent=2)+'\n')
    print(json.dumps({'observations':[{'slug':r['slug'],'status':r['http_status']} for r in observations], 'factory_package_bytes':len(archive),'deterministic':repeat_identical,'unsafe_endpoint_rejected':True},ensure_ascii=False))
    if not repeat_identical:
        raise SystemExit('Evidence recorded: production package determinism failed; source correction exists but production rollout is not verified.')

if __name__ == '__main__':
    main()
