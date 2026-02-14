import { useState } from "react";
import { useAlert } from "../context/AlertContext";
import { Mail, User, MessageSquare } from "lucide-react";

const Contact = () => {
  const { showAlert } = useAlert();

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await emailjs.send(
        "service_xxxxx",
        "template_yyyyy",
        form,
        "public_zzzzz"
      );

      showAlert("Message sent successfully!", "success");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      showAlert("Failed to send message", "error");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-bold text-center mb-2">
          Contact Support
        </h1>
        <p className="text-center text-gray-500 mb-8">
          We’d love to hear from you
        </p>

        <form
          onSubmit={submitHandler}
          className="space-y-5 bg-white dark:bg-gray-800
            p-6 md:p-8 rounded-2xl shadow-md"
        >
          {/* NAME */}
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-3 py-2 border rounded-lg
                focus:ring-2 focus:ring-black outline-none"
            />
          </div>

          {/* EMAIL */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-3 py-2 border rounded-lg
                focus:ring-2 focus:ring-black outline-none"
            />
          </div>

          {/* MESSAGE */}
          <div className="relative">
            <MessageSquare
              className="absolute left-3 top-3 text-gray-400"
              size={18}
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows="4"
              value={form.message}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-3 py-2 border rounded-lg
                focus:ring-2 focus:ring-black outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2.5 rounded-lg
              hover:bg-gray-800 transition font-medium"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
