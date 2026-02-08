const Terms = () => {
  return (
    <div className="min-h-screen bg-black text-zinc-400 p-8 leading-relaxed">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12 border-b border-zinc-800 pb-6">
          <h1 className="text-3xl font-bold text-white">
            User Terms & Conditions
          </h1>
          <p className="text-sm mt-2 text-zinc-500 font-mono">
            EFFECTIVE_DATE: FEB_2026
          </p>
        </header>

        <section className="space-y-10">
          {/* 01 */}
          <div>
            <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-3">
              01. Verified Profiles
            </h2>
            <p>
              HashTribe is built on proof, not claims. Users must not
              misrepresent technical skills, experience, or contribution
              history.
            </p>
            <p className="mt-2">
              Any attempt to manipulate credibility metrics — including
              proof-faking scripts, automation abuse, or AI-generated activity
              intended to deceive — may result in permanent removal from the
              HashTribe network.
            </p>
          </div>

          {/* 02 */}
          <div>
            <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-3">
              02. Accounts & Access
            </h2>
            <p>
              You are responsible for maintaining the security of your account
              credentials and for all activity performed under your account.
            </p>
            <p className="mt-2">
              Unauthorized access attempts, credential sharing, or attempts to
              bypass platform safeguards are strictly prohibited.
            </p>
          </div>

          {/* 03 */}
          <div>
            <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-3">
              03. Intellectual Property
            </h2>
            <p>
              Code or content you submit during HashTribe challenges, discussions,
              or Tribes remains your intellectual property unless explicitly
              stated otherwise.
            </p>
            <p className="mt-2">
              By participating in a Tribe, you agree to any collaboration or
              licensing terms defined within that Tribe’s scope.
            </p>
          </div>

          {/* 04 */}
          <div>
            <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-3">
              04. Platform Usage
            </h2>
            <p>
              HashTribe is a developer credibility and collaboration platform.
              Abuse of platform features undermines the ecosystem.
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Spamming or unsolicited promotion</li>
              <li>Harassment or targeted abuse</li>
              <li>Unauthorized scraping or data mining</li>
              <li>Malicious automation or exploitation</li>
            </ul>
          </div>

          {/* 05 */}
          <div>
            <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-3">
              05. Enforcement & Termination
            </h2>
            <p>
              We reserve the right to suspend or terminate accounts that violate
              these terms or pose a risk to the community.
            </p>
            <p className="mt-2">
              Enforcement decisions may be automated or manual and are final.
            </p>
          </div>

          {/* 06 */}
          <div>
            <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-3">
              06. Service Availability
            </h2>
            <p>
              HashTribe is provided on an “as-is” and “as-available” basis.
              Platform features may change, evolve, or be discontinued without
              prior notice.
            </p>
          </div>

          {/* 07 */}
          <div>
            <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-3">
              07. Limitation of Liability
            </h2>
            <p>
              HashTribe is not liable for loss of data, reputation impact, or
              indirect damages resulting from platform use or downtime.
            </p>
          </div>

          {/* 08 */}
          <div>
            <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-3">
              08. Term Mutations
            </h2>
            <p>
              These terms may be updated as the platform evolves. Material
              changes will be reflected by an updated effective date.
            </p>
            <p className="mt-2">
              Continued use of HashTribe constitutes acceptance of the latest
              revision.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Terms;
