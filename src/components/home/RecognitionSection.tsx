export default function RecognitionSection() {
  return (
    <section
      className="w-full"
      style={{ background: "#f7f4ef", borderTop: "1px solid #e8e0d0", borderBottom: "1px solid #e8e0d0" }}
    >
      <div className="w-full px-6 md:px-12 lg:px-20 py-12 md:py-16">
        {/* Title */}
        <h2
          className="text-2xl md:text-3xl font-extrabold mb-8 text-center tracking-wide uppercase"
          style={{ color: "#0d1b3e", letterSpacing: "0.08em" }}
        >
          Recognitions &amp; Registrations
        </h2>

        {/* Full-width content box */}
        <div
          className="w-full rounded-2xl px-8 md:px-14 py-10 md:py-12"
          style={{
            background: "#ffffff",
            border: "1.5px solid #e8e0d0",
            boxShadow: "0 4px 32px 0 rgba(13,27,62,0.07)",
          }}
        >
          <p
            className="text-base md:text-lg leading-relaxed mb-6"
            style={{ color: "#3d3d3d", fontFamily: "'Inter', sans-serif" }}
          >
            LIS Academy is duly recognized for undertaking{" "}
            <strong>Corporate Social Responsibility (CSR)</strong> activities,
            holding Registration No. <strong>CSR00108081</strong>. It has been
            granted tax exemption under{" "}
            <strong>Section 12AA of the Income Tax Act, 1961</strong>, and is
            registered under <strong>NGO Darpan</strong> with the Government of
            India.
          </p>
          <p
            className="text-base md:text-lg leading-relaxed"
            style={{ color: "#3d3d3d", fontFamily: "'Inter', sans-serif" }}
          >
            Further, the Academy holds{" "}
            <strong>FCRA Registration No. 094421841</strong>, issued by the
            Ministry of Home Affairs, Government of India, New Delhi, enabling
            it to receive financial assistance and contributions from foreign
            sources in compliance with applicable regulations.
          </p>
        </div>
      </div>
    </section>
  );
}
