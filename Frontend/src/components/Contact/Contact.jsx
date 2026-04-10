import { useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Mail,
  Github,
  Code2,
  CheckCircle,
  Loader2,
  MapPin,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import "./Contact.css";

const TYPES = [
  { v: "project", l: "Project" },
  { v: "job", l: "Job" },
  { v: "collaboration", l: "Collab" },
  { v: "general", l: "General" },
];

const INIT = { name: "", email: "", subject: "", message: "", type: "general" };

export default function Contact() {
  const [form, setForm] = useState(INIT);
  const [loading, setL] = useState(false);
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error("Fill all fields");
      return;
    }

    setL(true);

    try {
      const res = await fetch("/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(payload?.message || "Failed to send message");
      }

      setSent(true);
      toast.success(payload?.message || "Message sent! I'll reply soon.");
      setForm(INIT);
      setTimeout(() => setSent(false), 4000);
    } catch (error) {
      toast.error(error.message || "Failed. Try again.");
    } finally {
      setL(false);
    }
  };

  return (
    <section className="contact section" id="contact">
      <div className="contact__bg-text">CONTACT</div>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="contact__header"
        >
          <span className="section-tag">Get in touch</span>
          <h2 className="section-title">
            Let's <span>Connect</span>
          </h2>
        </motion.div>

        <div className="contact__grid">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="contact__info">
              <div className="contact__info-item">
                <div className="contact__info-icon">
                  <Mail size={18} />
                </div>
                <div>
                  <div className="contact__info-label">Email</div>
                  <div className="contact__info-val">rajp182138@gmail.com</div>
                </div>
              </div>
              <div className="contact__info-item">
                <div className="contact__info-icon">
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="contact__info-label">Location</div>
                  <div className="contact__info-val">India</div>
                </div>
              </div>
              <div className="contact__info-item">
                <div className="contact__info-icon">
                  <Clock size={18} />
                </div>
                <div>
                  <div className="contact__info-label">Response Time</div>
                  <div className="contact__info-val">Within 24 hours</div>
                </div>
              </div>
            </div>

            <div className="contact__socials">
              {[
                {
                  l: "GitHub",
                  h: "https://github.com/byteRaj-commits",
                  icon: <Github size={18} />,
                },
                {
                  l: "LeetCode",
                  h: "https://leetcode.com/u/Raj7753/",
                  icon: <Code2 size={18} />,
                },
                {
                  l: "GeeksForGeeks",
                  h: "https://www.geeksforgeeks.org/profile/rajp18zsll",
                  icon: <span className="contact__gfg">GfG</span>,
                },
              ].map((s) => (
                <a
                  key={s.l}
                  href={s.h}
                  target="_blank"
                  rel="noreferrer"
                  className="contact__social"
                >
                  {s.icon}
                  <span>{s.l}</span>
                </a>
              ))}
            </div>

            <div className="contact__avail">
              <span className="contact__avail-dot" />
              Available for freelance & full-time
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <form className="contact__form" onSubmit={submit}>
              <div className="contact__types">
                {TYPES.map((t) => (
                  <button
                    key={t.v}
                    type="button"
                    className={`contact__type ${form.type === t.v ? "contact__type--on" : ""}`}
                    onClick={() => setForm((f) => ({ ...f, type: t.v }))}
                  >
                    {t.l}
                  </button>
                ))}
              </div>
              <div className="contact__row">
                <div className="contact__field">
                  <label className="contact__label">Name</label>
                  <input
                    className="contact__input"
                    placeholder="Your name"
                    value={form.name}
                    onChange={set("name")}
                  />
                </div>
                <div className="contact__field">
                  <label className="contact__label">Email</label>
                  <input
                    className="contact__input"
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={set("email")}
                  />
                </div>
              </div>
              <div className="contact__field">
                <label className="contact__label">Subject</label>
                <input
                  className="contact__input"
                  placeholder="What's this about?"
                  value={form.subject}
                  onChange={set("subject")}
                />
              </div>
              <div className="contact__field">
                <label className="contact__label">Message</label>
                <textarea
                  className="contact__textarea"
                  rows={5}
                  placeholder="Tell me about your project..."
                  value={form.message}
                  onChange={set("message")}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary contact__submit"
                disabled={loading}
              >
                {sent ? (
                  <>
                    <CheckCircle size={16} /> Sent!
                  </>
                ) : loading ? (
                  <>
                    <Loader2 size={16} className="contact__spin" /> Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} /> Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
