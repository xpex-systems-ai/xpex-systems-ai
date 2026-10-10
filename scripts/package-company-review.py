#!/usr/bin/env python3
"""Build the public review package from an explicit public-file allowlist."""
import hashlib
import io
import json
import pathlib
import zipfile

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUTPUT = ROOT / 'site/public/company/xpex-company-review-pack-v1.zip'

def build():
    plan = json.loads((ROOT/'data/company/company-readiness-v1.json').read_text())
    paths = ['docs/SYSTEM_STANDARD.md', 'data/company/company-readiness-v1.json',
             'data/company/preparation-source-observations-v1.json',
             'data/company/company-demo-observations-v1.json',
             'site/public/company/company-review.json',
             'site/public/company/factory-demo.blueprint.json',
             'site/public/company/factory-demo.zip',
             'templates/company-preparation/financial-inputs.json']
    paths.extend(item['path'] for item in plan['public_materials'])
    for system in plan['systems']:
        pack = system['pack']
        paths.extend(f'{pack}/{name}' for name in ['README.md','system-card.json','ai-bom.json',
                                                  'preparation.json','evidence/preparation-observation.json'])
        paths.append(f"data/trust/system-passports/{pack.split('/')[-1]}.json")
    assert len(paths) == len(set(paths)), 'Duplicate review entries'
    entries = {name:(ROOT/name).read_bytes() for name in sorted(paths)}
    manifest = {
        'schema_version':'1.0', 'public_safe':True, 'scope':'Public preparation documents and dated evidence',
        'private_documents_included':False, 'legal_title_verified':False,
        'independent_acceptance':'PENDING', 'system_dossiers':len(plan['systems']),
        'files':[{'path':name,'bytes':len(body),'sha256':hashlib.sha256(body).hexdigest()}
                 for name,body in entries.items()]
    }
    entries['MANIFEST.json'] = (json.dumps(manifest,ensure_ascii=False,indent=2)+'\n').encode()
    entries['README.txt'] = (
        'XPeX Systems AI — Public Company Review Pack\n'
        'Prepared 10 October 2026. Start with docs/company/preparation/COMPANY_OVERVIEW.md.\n'
        'Seven system dossiers preserve their actual stages. Financial and legal unknowns remain explicit.\n'
        'This archive contains no private room documents, credentials or customer records.\n'
        'Factory source correction and production acceptance are separate; inspect dated demo evidence.\n'
        'Preparation is not investment approval, title verification or independent acceptance.\n'
    ).encode()
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as archive:
        for name,body in sorted(entries.items()):
            info=zipfile.ZipInfo(name,date_time=(2026,10,10,0,0,0))
            info.compress_type=zipfile.ZIP_DEFLATED
            info.external_attr=0o100644 << 16
            archive.writestr(info,body,compress_type=zipfile.ZIP_DEFLATED,compresslevel=9)
    result=buffer.getvalue()
    with zipfile.ZipFile(io.BytesIO(result)) as archive:
        assert archive.testzip() is None
        assert sum(name.startswith('systems/') and name.endswith('/preparation.json') for name in archive.namelist()) == 7
    OUTPUT.write_bytes(result)
    print(json.dumps({'path':str(OUTPUT),'files':len(entries),'bytes':len(result),
                      'sha256':hashlib.sha256(result).hexdigest()}))
    return result

if __name__ == '__main__':
    build()
