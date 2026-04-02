import { AlertTriangle, FileText } from 'lucide-react';

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 lg:pb-0 animate-fade-in bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
      <div className="border-b border-slate-100 pb-6 mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <FileText className="w-8 h-8 text-primary-600" />
          Terms & Conditions
        </h1>
        <p className="text-slate-500 mt-2">Last updated: April 2026. Designed in alignment with IRDAI guidelines.</p>
      </div>

      <div className="space-y-10 text-slate-700 text-sm leading-relaxed">
        
        <section>
          <h2 className="text-xl font-bold text-primary-700 mb-3">1. Coverage Scope</h2>
          <p>GigShield provides weekly parametric income protection for platform-based delivery partners operating with Zomato or Swiggy in India. Coverage is for loss of working income only, triggered by verified external disruption events. All coverage requires an active weekly subscription plan.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary-700 mb-3">2. What Is Covered</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Heavy Rainfall</strong>: exceeding 50mm in 3 hours (100% missing income payout, All plans).</li>
            <li><strong>Extreme Heat</strong>: above 43°C for 4+ hours (50% missing income payout, Standard & Premium).</li>
            <li><strong>Severe Pollution</strong>: AQI above 300 (50% missing income payout, Standard & Premium).</li>
            <li><strong>Curfew/Strike</strong>: Verified government order affecting your zone (100% missing income payout, Premium only).</li>
            <li><strong>Platform Outage</strong>: Downtime exceeding 2 hours (Pro-rated missing income payout, All plans).</li>
          </ul>
        </section>

        {/* Critical Exclusion Section Highlights */}
        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
             <AlertTriangle className="w-6 h-6 text-amber-600" />
             <h2 className="text-xl font-bold text-amber-900">3. Exclusions</h2>
          </div>
          <p className="mb-4 text-amber-800 font-medium">The following are explicitly excluded from all coverage:</p>
          <ul className="list-disc pl-5 space-y-2 text-amber-900">
            <li>War, civil war, invasion, armed conflict, or any act of military force</li>
            <li>Government-declared national pandemic or epidemic (including but not limited to disease outbreaks classified by WHO or Indian government)</li>
            <li>Nuclear, chemical, radiological, or biological contamination or attack</li>
            <li>Terrorism or politically motivated violence</li>
            <li>Voluntary absence or personal choice not to work</li>
            <li>Vehicle mechanical failures, punctures, or repairs</li>
            <li>Personal health, medical, or accident expenses</li>
            <li>Losses not directly caused by a verified parametric trigger event as defined in Section 2</li>
            <li>Fraudulent claims, GPS location spoofing, false representation of location or activity</li>
            <li>Losses occurring when no active GigShield policy exists at the time of the trigger event</li>
            <li>Losses caused by the rider's own delivery platform account suspension or deactivation</li>
            <li>Pre-existing disruptions that began before policy activation</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary-700 mb-3">4. Premium & Payment Terms</h2>
          <p>Premiums are charged weekly on the policy activation date. The premium is dynamically calculated by GigShield's AI model and may vary based on zone risk score, seasonal index, Trust Score, and claim history. GigShield reserves the right to update premium calculation parameters with 7 days notice.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary-700 mb-3">5. Claim Process</h2>
          <p>All claims are initiated automatically by GigShield's trigger monitoring system. Riders do not need to file claims manually. Automated fraud verification including GPS validation, platform activity check, and ML anomaly detection runs on every claim. Approved claims are processed within 30 minutes to the rider's registered UPI ID.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary-700 mb-3">6. IRDAI Compliance Statement</h2>
          <p>GigShield is designed as a parametric income protection product in alignment with IRDAI microinsurance product regulations and guidelines for gig economy coverage. This product does not constitute a traditional indemnity insurance policy. All terms are subject to applicable Indian insurance regulatory framework.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary-700 mb-3">7. Data Privacy</h2>
          <p>All personal data including income figures and location data is collected and processed in compliance with the Digital Personal Data Protection Act 2023 (India). Data is used solely for premium calculation, claim verification, and fraud detection. Data is never shared with or sold to any third party without explicit consent.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary-700 mb-3">8. Fraud Policy</h2>
          <p>Any attempt to manipulate GPS location data, file duplicate or fabricated claims, or misrepresent any disruption circumstances will result in immediate permanent account suspension and forfeiture of all pending payouts. GigShield employs a 6-layer signal validation system and DBSCAN clustering for coordinated fraud ring detection.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary-700 mb-3">9. Cancellation & Refunds</h2>
          <p>Riders may cancel at any time from the Settings page. The current week's premium is non-refundable. No future weekly charges will apply from the date of cancellation.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary-700 mb-3">10. Dispute Resolution</h2>
          <p>Claim disputes must be raised within 7 days of the claim decision. GigShield will review and respond within 48 business hours.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary-700 mb-3">11. Governing Law</h2>
          <p>These terms are governed by the laws of the Republic of India. All disputes are subject to the exclusive jurisdiction of courts in Bengaluru, Karnataka, India.</p>
        </section>

      </div>
    </div>
  );
}
