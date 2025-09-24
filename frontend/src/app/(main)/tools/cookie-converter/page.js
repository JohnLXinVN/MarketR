"use client";
import { useState } from "react";

export default function CookieConverterPage() {
  const [input, setInput] = useState("");

  const handleConvert = () => {
    if (!input.trim()) return;

    // Chia từng dòng & convert
    const lines = input.split("\n").filter((l) => l.trim() !== "");
    const jsonData = lines.map((line) => ({
      domain: line.trim(),
      expirationDate: null,
    }));

    // Tạo file JSON
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    // Tạo link download
    const a = document.createElement("a");
    a.href = url;
    a.download = "cookies.json.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 p-6">
      {/* Title */}
      <h1 className="text-xl font-bold text-white mb-6">
        NETSCAPE TO JSON COOKIE CONVERTER
      </h1>

      {/* Example box */}
      <div className="bg-gray-900/60 border border-gray-700 rounded-md p-4 mb-6">
        <h2 className="text-sm text-gray-400 mb-2">Example:</h2>
        <pre className="text-xs text-gray-300 whitespace-pre-wrap overflow-x-auto">
          {`.srv.stackadapt.com    TRUE / 0 1335611655987679  ge-user-id %3A0-84654764-bf93-4deb-7a35-40e32f639386.XVfbTI00%2FfKekwRlkWzV5O5GajUpnFkGdr%2BiqSKNo
.srv.stackadapt.com    TRUE / 0 1335611655987694  sa-user-id-v2 %3A0-84654764-bf93-4deb-7a35-40e32f639386%24ip%7MR9fj26Fk3pP4aDE14oChpbRSh8%2BkxL9tLnBXw56jEAE
.thecustomdroid.com    TRUE / 1 1322997272703436  __cfduid dace9b19c42aa1fcbbc89f2ac04c10551559361215
.sharethis.com         TRUE / 0 132305049491602241 std ZGADGiyfmeEAAAA5uIKkAw==
.jzoot.com             TRUE / 0 132299730790731314 __cfduid dfcf276dc951f23cafc14913f11ac0e1553963495
.justanswer.com        TRUE / 0 132299730790731282 __cfduid d94799dc281d4f1f6c5bbda0bf6082e1553963495
.updato.com            TRUE / 0 132619509180000000 _gads ID=6b7c4bfb16b0649c-155396508:S-ALN_MZ10ocdKjqInimEuukY-Zs2RevR9w
.updato.com            TRUE / 0 132329059180000000 __gca_po 1437993344-1553963510656
.bidrio                TRUE / 0 13261494719648636 bito AAatUE65PQzAABdk5wOcA
.pippio.com            TRUE / 0 13229973122862938  did 54FoR9nLkg_TTgLn`}
        </pre>
      </div>

      {/* Input textarea */}
      <textarea
        className="w-full h-60 p-3 rounded-md bg-gray-900/60 border border-gray-700 text-gray-200 text-sm font-mono resize-none mb-6"
        placeholder={`|.bit.ly          TRUE / 0 13214340525584999  _bit j33i8l-6783c404d3ae2cb87a-00m
.mediafire.com  TRUE / 0 13230520201666420  __cfduid d6737159057711ff707c6dbc6480df45c1554492600
.mediafire.com  TRUE / 0 1325946203666516   ukey 9ufn9hba8q9fqlwi1tebgczqd49ez5v9
.technofizi.net TRUE / 1 13230549355271281  __cfduid d28e4beeaaa80db74280585db217b14011554539752...`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      {/* Convert button */}
      <div className="flex justify-center">
        <button
          onClick={handleConvert}
          className="px-6 py-2 cursor-pointer rounded-md bg-gray-700 hover:bg-gray-600 text-white font-semibold shadow"
        >
          Convert Now!
        </button>
      </div>
    </div>
  );
}
