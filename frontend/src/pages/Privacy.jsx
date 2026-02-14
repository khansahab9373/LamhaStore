const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8">
        <h1 className="text-3xl font-bold mb-4">
          Privacy Policy
        </h1>

        <p className="text-gray-700 mb-6 leading-relaxed">
          Your privacy is important to us. This Privacy Policy explains
          how we collect, use, and protect your personal information
          when you use our website and services.
        </p>

        <ul className="list-disc pl-6 space-y-3 text-gray-700">
          <li>
            We do not sell, rent, or share your personal data with
            third parties without your consent.
          </li>
          <li>
            Your data is stored securely using industry-standard
            security practices.
          </li>
          <li>
            Payment information is encrypted and processed securely
            through trusted payment providers.
          </li>
          <li>
            You can request access, correction, or deletion of your
            personal data at any time.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Privacy;
