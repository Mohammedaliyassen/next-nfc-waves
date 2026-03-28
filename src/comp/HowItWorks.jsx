import { motion } from "framer-motion";
import { CreditCard, Smartphone, Users, TrendingUp } from "lucide-react";
import Button from "./Button";

const steps = [
  {
    icon: CreditCard,
    title: "اختار الكارت المناسب",
    description:
      "اختار التصميم المناسب لك أو اطلب تنفيذ تصميم خاص يعبر عن هويتك وشغلك.",
    gradient: "linear-gradient(135deg, #22d3ee, #3b82f6)",
    borderColor: "#22d3ee",
  },
  {
    icon: Smartphone,
    title: "فعّل صفحتك وعدل بياناتك",
    description:
      "نجهز لك الصفحة الرقمية الخاصة بك، وتضيف عليها الروابط ووسائل التواصل والأعمال بسهولة.",
    gradient: "linear-gradient(135deg, #c084fc, #ec4899)",
    borderColor: "#c084fc",
  },
  {
    icon: Users,
    title: "شارك بياناتك بلمسة",
    description:
      "بمجرد تمرير الكارت على أي هاتف متوافق، تظهر صفحتك وبياناتك وروابطك مباشرة.",
    gradient: "linear-gradient(135deg, #4ade80, #10b981)",
    borderColor: "#4ade80",
  },
  {
    icon: TrendingUp,
    title: "زود انتشارك واحترافيتك",
    description:
      "استخدم الكارت في الاجتماعات والمعارض والزيارات ليكون تقديمك أسرع وأقوى وأكثر احترافية.",
    gradient: "linear-gradient(135deg, #facc15, #f97316)",
    borderColor: "#facc15",
  },
];

export function HowItWorks() {
  return (
    <section
      className="position-relative py-5 overflow-hidden"
      style={{ minHeight: "100vh", direction: "rtl" }}
    >
      <style>{`
        .step-badge {
          width: 3rem;
          height: 3rem;
          top: -1rem;
          right: -1rem;
          background: #020617;
          border: 2px solid #22d3ee;
        }
        .cta-box {
          background: rgba(30, 41, 59, 0.5);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(34, 211, 238, 0.3);
        }
      `}</style>

      <div className="position-absolute inset-0 w-100 h-100">
        <motion.div
          className="position-absolute w-100 h-100 "
          animate={{ backgroundPosition: ["0px 0px", "40px 40px"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="container position-relative z-1 py-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-5 pb-5"
        >
          <h2
            className="display-3 fw-bold mb-4 text-white"
            style={{
              background: "linear-gradient(to right, #22d3ee, #3b82f6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            كيف تعمل البطاقة؟
          </h2>
          <p className="lead text-secondary mx-auto" style={{ maxWidth: "650px" }}>
            خطوات بسيطة وسريعة لتبدأ في مشاركة بياناتك وأعمالك بشكل احترافي
          </p>
        </motion.div>

        <div className="mx-auto" style={{ maxWidth: "900px" }}>
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="position-relative mb-5"
            >
              <div className="row align-items-center g-5">
                <div className="col-12 col-md-auto text-center">
                  <div className="position-relative d-inline-block">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="rounded-4 d-flex align-items-center justify-content-center shadow-lg position-relative z-2"
                      style={{
                        width: "130px",
                        height: "130px",
                        borderRadius: "20px",
                        background: step.gradient,
                      }}
                    >
                      <step.icon size={64} color="white" strokeWidth={1.5} />

                      <div className="position-absolute step-badge rounded-circle d-flex align-items-center justify-content-center z-3">
                        <span className="h5 mb-0 fw-bold" style={{ color: "#22d3ee" }}>
                          {index + 1}
                        </span>
                      </div>
                    </motion.div>

                    <motion.div
                      className="position-absolute top-0 start-0 w-100 h-100 rounded-circle opacity-50"
                      style={{ background: step.gradient, filter: "blur(40px)", zIndex: 1 }}
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                </div>

                <div className="col-12 col-md text-center text-md-end">
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="h1 fw-bold text-white mb-3"
                  >
                    {step.title}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="h5 text-secondary fw-normal lh-base"
                  >
                    {step.description}
                  </motion.p>
                </div>
              </div>

              {index < steps.length - 1 && (
                <motion.div
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="d-none d-md-block position-absolute start-50 translate-middle-x"
                  style={{
                    top: "130px",
                    width: "2px",
                    height: "80px",
                    background: "linear-gradient(to bottom, #22d3ee, transparent)",
                    originY: 0,
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-5 pt-4"
        >
          <div className="cta-box d-inline-block rounded-4 p-4 p-md-5">
            <p className="h3 text-white mb-2">جاهز تبدأ بطاقتك الذكية؟</p>
            <p className="text-secondary mb-0">
              تواصل معنا الآن وجهز كارتك وصفحتك الرقمية بما يناسب شغلك
            </p>
          </div>
        </motion.div>
        <div className="d-flex justify-content-center">
          <Button
            classLabel="btnGo mt-1 mb-3"
            label="ابدأ الآن"
            to="https://api.whatsapp.com/send/?phone=201095303755&text&type=phone_number&app_absent=0"
            alt="ابدأ الآن"
            classLabelForA="d-flex justify-content-center ms-5 me-5 mt-5"
          />
        </div>
      </div>
    </section>
  );
}
