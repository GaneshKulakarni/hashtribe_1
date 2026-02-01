const Privacy = () => {
  return (
    <div className="min-h-screen bg-black text-zinc-400 p-8 leading-relaxed">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12 border-b border-zinc-800 pb-6">
          <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
          <p className="text-sm mt-2 text-zinc-500 font-mono">
            HASH_VERSION: 2026.02.v3
          </p>
        </header>

        <section className="space-y-10">
          {/* 01 */}
          <div>
            <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-3">
              01. Data Transmission
            </h2>
            <p>
              HashTribe analyzes publicly available developer activity such as
              GitHub or GitLab metadata to help establish credibility within the
              platform. We never access or store private repositories or source
              code.
            </p>
            <p className="mt-2">
              Indexed data may include commit frequency, language distribution,
              pull request impact, and contribution timelines — strictly at a
              metadata level.
            </p>
          </div>

          {/* 02 */}
          <div>
            <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-3">
              02. Identity & Accounts
            </h2>
            <p>
              Account authentication and identity management are handled through
              secure third-party infrastructure (such as Supabase). Passwords
              are never stored in plain text.
            </p>
            <p className="mt-2">
              Your profile represents a developer persona, not a surveillance
              target. We collect only what is required for platform integrity.
            </p>
          </div>

          {/* 03 */}
          <div>
            <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-3">
              03. Tribe Interaction
            </h2>
            <p>
              Activity inside Tribes (posts, discussions, reactions) is visible
              to other Tribe members. Transparency is a core principle of the
              HashTribe ecosystem.
            </p>
            <p className="mt-2">
              Proof-based metrics and reputation indicators are public by
              default unless explicitly stated otherwise.
            </p>
          </div>

          {/* 04 */}
          <div>
            <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-3">
              04. Cookies & Sessions
            </h2>
            <p>
              HashTribe uses cookies and local storage primarily for session
              persistence, authentication state, and basic analytics.
            </p>
            <p className="mt-2">
              We do not use invasive tracking, ad profiling, or cross-site
              behavioral monitoring.
            </p>
          </div>

          {/* 05 */}
          <div>
            <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-3">
              05. Security
            </h2>
            <p>
              All data is encrypted in transit and at rest. Industry-standard
              security practices are applied across the platform.
            </p>
            <p className="mt-2">
              While we explore decentralized identity and privacy-preserving
              technologies, no system can guarantee absolute security.
            </p>
          </div>

          {/* 06 */}
          <div>
            <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-3">
              06. Data Control
            </h2>
            <p>
              You may request access, correction, or deletion of your account
              data at any time. We believe developers should retain agency over
              their digital identity.
            </p>
          </div>

          {/* 07 */}
          <div>
            <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-3">
              07. Third-Party Services
            </h2>
            <p>
              HashTribe integrates with external services strictly for
              authentication, hosting, and analytics. These services are bound
              by their own privacy policies.
            </p>
          </div>

          {/* 08 */}
          <div>
            <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-3">
              08. Policy Mutations
            </h2>
            <p>
              This policy may evolve as HashTribe grows. Any material changes
              will be reflected by an updated hash version.
            </p>
            <p className="mt-2">
              Continued use of the platform implies acceptance of the latest
              revision.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
