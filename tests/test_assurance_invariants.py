from __future__ import annotations
import json
import pathlib
import unittest

ROOT=pathlib.Path(__file__).resolve().parents[1]

class AssuranceInvariants(unittest.TestCase):
    def load(self, rel):
        return json.loads((ROOT/rel).read_text(encoding="utf-8"))

    def test_verified_live_systems_have_runtime_proof(self):
        index=self.load("data/company/system-index-v1.json")
        for item in index["systems"]:
            if item.get("runtime_status")!="VERIFIED_LIVE" or not item.get("system_pack"):
                continue
            card=self.load(item["system_pack"]+"system-card.json")
            self.assertIn(card["source"]["verification_status"],{"VERIFIED","VERIFIED_REPOSITORY"})
            self.assertIn(card["runtime"]["state_at_verification"],{"READY","SUCCESS"})
            self.assertTrue(card["runtime"].get("deployment_id"))
            self.assertTrue(card.get("evidence"))

    def test_formal_partner_claims_need_formal_status(self):
        reg=self.load("data/providers/provider-registry-v1.json")
        for provider in reg["providers"]:
            if provider.get("public_partner_claim"):
                self.assertIn(provider.get("relationship_status"),{"FORMAL_PARTNER","COSELL_PARTNER"})

    def test_agent_runtime_truth(self):
        reg=self.load("data/agents/agent-registry-v1.json")
        for agent in reg["agents"]:
            runtime=agent.get("runtime_status","")
            if runtime.startswith("NOT_DEPLOYED"):
                self.assertNotIn(agent.get("governance_status"),{"AUTONOMOUS_PRODUCTION","VERIFIED_AUTONOMOUS_RUNTIME"})

    def test_trust_passports_do_not_self_certify(self):
        for p in (ROOT/"data/trust/system-passports").glob("*.json"):
            d=json.loads(p.read_text())
            self.assertNotEqual(d.get("overall_trust_state"),"TP4_CONTINUOUSLY_ASSURED")
        for p in (ROOT/"data/trust/agent-passports").glob("*.json"):
            d=json.loads(p.read_text())
            self.assertNotEqual(d.get("overall_trust_state"),"TP4_CONTINUOUSLY_ASSURED")

if __name__=="__main__":
    unittest.main()
