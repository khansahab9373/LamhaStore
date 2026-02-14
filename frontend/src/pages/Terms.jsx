const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-6 border-b pb-3">
          Terms & Conditions
        </h1>

        <p className="text-gray-700 mb-6 leading-relaxed">
          By using <span className="font-semibold">LamhaStore</span>, you agree
          to the following terms and conditions. Please read them carefully
          before using our platform.
        </p>

        <ul className="list-disc pl-6 space-y-3 text-gray-700 leading-relaxed">
          <li>
            Products purchased are for <strong>personal use only</strong>.
          </li>
          <li>
            Product prices and availability may change without prior notice.
          </li>
          <li>
            Orders once shipped <strong>cannot be cancelled</strong>.
          </li>
          <li>
            Any misuse of the platform may result in temporary or permanent
            account suspension.
          </li>
        </ul>

        <p className="mt-6 text-sm text-gray-500">
          If you have any questions regarding these terms, please contact our
          support team.
        </p>
      </div>
    </div>
  );
};

export default Terms;
