 "use client";

import React, { useState } from "react";
import Button from "./Button";

const faqItems = [
  {
    question: "ازاي أقدر أسجل دخول؟",
    answer: (
      <div className="qa-answer-content">
        <p>
          بنبعت لك بيانات الدخول بعد تفعيل البطاقة، وبعدها تدخل على صفحة تسجيل
          الدخول وتكتب الإيميل وكلمة المرور الخاصة بك.
        </p>
        <div className="qa-tags">
          <span>1. افتح صفحة Login</span>
          <span>2. اكتب بياناتك</span>
          <span>3. ادخل على لوحة التحكم</span>
        </div>
      </div>
    ),
  },
  {
    question: "ازاي أجيب روابط السوشيال ميديا الصحيحة؟",
    answer: (
      <div className="qa-answer-content">
        <p>افتح حسابك على المنصة، ثم اختر مشاركة أو نسخ الرابط وضعه كما هو.</p>
        <div className="qa-link-examples">
          <span>Instagram: `instagram.com/username`</span>
          <span>Facebook: `facebook.com/username`</span>
          <span>LinkedIn: `linkedin.com/in/username`</span>
          <span>WhatsApp: `wa.me/2010XXXXXXX`</span>
        </div>
      </div>
    ),
  },
  {
    question: "هل أقدر أضيف فودافون كاش و InstaPay؟",
    answer: (
      <div className="qa-answer-content">
        <p>
          نعم، تقدر تضيف بيانات الدفع داخل الوصف أو كبيانات واضحة داخل البروفايل.
          لو عندك رقم فودافون كاش أو معرف InstaPay نضيفه لك بشكل مرتب وسهل
          نسخه.
        </p>
        <div className="qa-tags">
          <span>Vodafone Cash: رقم المحفظة</span>
          <span>InstaPay: username أو handle</span>
          <span>QR متاح لو تحب</span>
        </div>
      </div>
    ),
  },
  {
    question: "إيه البيانات اللي أجهزها قبل ما نرفع صفحتي؟",
    answer: (
      <div className="qa-answer-content">
        <p>
          جهز اسمك، الوظيفة، صورة شخصية واضحة، نبذة قصيرة، وروابط السوشيال أو
          الأعمال التي تريد عرضها.
        </p>
        <div className="qa-tags">
          <span>الاسم</span>
          <span>المسمى الوظيفي</span>
          <span>الصورة الشخصية</span>
          <span>النبذة</span>
          <span>روابط التواصل</span>
        </div>
      </div>
    ),
  },
  {
    question: "هل أقدر أطبع تصميمي الخاص على الكارت؟",
    answer: (
      <div className="qa-answer-content">
        <p>
          نعم، تقدر تطبع هويتك البصرية أو تصميمك الخاص على الكارت، سواء كان شعار
          النشاط أو ألوان البراند أو بيانات معينة تحب تظهر بشكل مميز.
        </p>
        <div className="qa-tags">
          <span>شعارك الخاص</span>
          <span>ألوان البراند</span>
          <span>تصميم مخصص</span>
          <span>مراجعة قبل الطباعة</span>
        </div>
      </div>
    ),
  },
  {
    question: "هل يوجد عروض على الكميات؟",
    answer: (
      <div className="qa-answer-content">
        <p>
          نعم، يمكن توفير أسعار خاصة للطلبات الجماعية أو للشركات والفرق والمندوبين،
          وكلما زادت الكمية كانت فرصة الحصول على عرض أفضل أكبر.
        </p>
        <div className="qa-tags">
          <span>خصومات للكميات</span>
          <span>للشركات والفرق</span>
          <span>تسعير حسب العدد</span>
        </div>
      </div>
    ),
  },
  {
    question: "كيف أقدر أستفيد من الكارت بأفضل شكل؟",
    answer: (
      <div className="qa-answer-content">
        <p>
          أفضل استفادة تكون عندما تضع أهم روابطك، وسيلة تواصل مباشرة، نبذة قصيرة
          واضحة، وأمثلة من أعمالك حتى يتحول الكارت إلى نقطة تعريف سريعة واحترافية
          بك في أي مقابلة أو اجتماع.
        </p>
        <div className="qa-tags">
          <span>رابط واتساب مباشر</span>
          <span>نماذج أعمال</span>
          <span>نبذة مختصرة</span>
          <span>صورة شخصية واضحة</span>
        </div>
      </div>
    ),
  },
  {
    question: "هل أقدر أكون سبونسر على عدد من الكروت كإعلان لبرندي؟",
    answer: (
      <div className="qa-answer-content">
        <p>
          نعم، يمكن تنفيذ فكرة رعاية أو Branding على عدد من الكروت لزيادة
          الانتشار، مثل وضع شعارك أو تعريف مختصر بجهتك على دفعة مخصصة حسب
          الاتفاق.
        </p>
        <div className="qa-tags">
          <span>Branded Cards</span>
          <span>انتشار أكبر</span>
          <span>ظهور إعلاني</span>
          <span>تنفيذ حسب الاتفاق</span>
        </div>
      </div>
    ),
  },
  {
    question: "كيف أجيب رابط الدفع المباشر أو QR لمحافظ فودافون كاش واتصالات كاش وأورنج كاش؟",
    answer: (
      <div className="qa-answer-content">
        <p>
          تقدر تشارك استقبال الأموال من خلال رابط مباشر أو رمز QR من تطبيق
          المحفظة. فيما يلي الخطوات بشكل مرتب، مع ملاحظة أن اسم الخيار قد يختلف
          قليلًا حسب تحديث التطبيق.
        </p>

        <div className="qa-steps-block">
          <h4>فودافون كاش</h4>
          <ol className="qa-steps">
            <li>افتح تطبيق `Ana Vodafone` وسجل الدخول باستخدام إنترنت الشريحة.</li>
            <li>ادخل إلى قسم `Vodafone Cash` من الصفحة الرئيسية.</li>
            <li>اختر `رمز الـ QR` أو `QR Code` داخل صفحة المحفظة.</li>
            <li>يمكنك تعديل الاسم الظاهر عند مسح الكود.</li>
            <li>يمكنك تحديد مبلغ مسبقًا ليظهر تلقائيًا للمرسل.</li>
            <li>اعرض الكود للطرف الآخر أو احفظه كصورة وأرسله عبر واتساب.</li>
            <li>إذا ظهر خيار `مشاركة رابط التحويل` يمكنك نسخه وإرساله مباشرة.</li>
          </ol>
        </div>

        <div className="qa-steps-block">
          <h4>اتصالات كاش</h4>
          <ol className="qa-steps">
            <li>افتح تطبيق `My Etisalat` أو تطبيق المحفظة وسجل الدخول.</li>
            <li>ادخل إلى قسم `Etisalat Cash` أو `المحفظة`.</li>
            <li>ابحث عن خيار `QR` أو `استقبال الأموال` أو `طلب دفع`.</li>
            <li>أنشئ رمز الدفع، وحدد الاسم أو المبلغ إن كان الخيار متاحًا.</li>
            <li>شارك الكود كصورة أو انسخ رابط الطلب إذا وفره التطبيق.</li>
          </ol>
        </div>

        <div className="qa-steps-block">
          <h4>أورنج كاش</h4>
          <ol className="qa-steps">
            <li>افتح تطبيق `My Orange` أو تطبيق المحفظة المرتبط بـ `Orange Cash`.</li>
            <li>ادخل إلى خدمات `Orange Cash` ثم اختر `QR` أو `استلام الأموال`.</li>
            <li>أنشئ الكود الخاص بك وحدد مبلغًا مسبقًا إذا احتجت ذلك.</li>
            <li>احفظ الـ QR أو شاركه مباشرة للطرف الذي سيقوم بالتحويل.</li>
            <li>إذا كان التطبيق يدعم رابط تحويل مباشر يمكنك نسخه ومشاركته.</li>
          </ol>
        </div>
      </div>
    ),
  },
];

const guideCards = [
  {
    step: "01",
    title: "تسجيل الدخول",
    text: "ادخل بالإيميل وكلمة المرور، وبعدها ستصل مباشرة إلى صفحة التعديل وإدارة البيانات.",
  },
  {
    step: "02",
    title: "تجهيز الروابط",
    text: "انسخ رابط كل منصة من حسابك الرسمي وضعه كما هو بدون اختصار أو تعديل.",
  },
  {
    step: "03",
    title: "بيانات الدفع",
    text: "يمكن إضافة رقم فودافون كاش أو اسم InstaPay داخل الوصف أو كجزء واضح من بيانات التواصل.",
  },
  {
    step: "04",
    title: "شرح بصري",
    text: "لو عندك QR أو تصميم أو صورة توضيحية، نقدر نعرضه داخل الأعمال أو ضمن محتوى البطاقة.",
  },
];

const QaComponent = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAnswer = (index) => {
    setOpenIndex((currentIndex) => (currentIndex === index ? -1 : index));
  };

  return (
    <section className="qa-component">
      <div className="qa-heading">
        <span className="qa-kicker">FAQ</span>
        <h2>الأسئلة الشائعة</h2>
        <p>كل ما تحتاجه لتجهيز صفحتك على Waves NFC بشكل سريع وواضح.</p>
      </div>

      <div className="qa-list">
        {faqItems.map((item, index) => (
          <div key={item.question} className="qa-item">
            <button
              type="button"
              className={`qa-question ${openIndex === index ? "active" : ""}`}
              onClick={() => toggleAnswer(index)}
              aria-expanded={openIndex === index}
            >
              <span>{item.question}</span>
              <span className="qa-toggle">{openIndex === index ? "-" : "+"}</span>
            </button>
            {openIndex === index ? (
              <div className="qa-answer open">
                {item.answer}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="qa-guides">
        {guideCards.map((card) => (
          <article key={card.step} className="qa-guide-card">
            <span className="qa-guide-step">{card.step}</span>
            <h3>{card.title}</h3>
            <p>{card.text}</p>
          </article>
        ))}
      </div>

      <div className="qa-cta">
        <Button
          classLabel="btnGo mt-1 mb-3"
          label="اتواصل الآن"
          to="https://api.whatsapp.com/send/?phone=201095303755&text&type=phone_number&app_absent=0"
          alt="اتواصل الآن"
          classLabelForA="d-flex justify-content-center ms-5 me-5 mt-4"
        />
      </div>
    </section>
  );
};

export default QaComponent;
