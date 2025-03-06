import React from "react";

function Peta() {
  return (
    <div className="bg-pastel-blue p-6 rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-semibold mb-4">Alamat Kami</h2>
      <div className="flex justify-center">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.685776935761!2d100.3796658!3d-0.4670263!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2fd524ef6ffc7f63%3A0xba2854e91c11640d!2sPanti%20Sosial%20Asuhan%20Anak%20Tri%20Murni!5e0!3m2!1sen!2sid!4v1738336449858!5m2!1sen!2sid"
          width="1000"
          height="600"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}

export default Peta;
