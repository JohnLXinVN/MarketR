export default function FAQPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full text-white">
      <div className="max-w-3xl px-6 py-12 text-left space-y-6">
        <h1 className="text-3xl font-bold mb-6 text-center">FAQ</h1>

        <ol className="list-decimal list-inside space-y-4 text-lg leading-relaxed">
          <li>
            CHECKER IS AVAILABLE WITHIN 10 MINUTES. IF YOU DID NOT CHECK THE
            CARD IN THIS TIME, THE CARD BECOMES{" "}
            <span className="font-semibold">&quot;VALID&quot;</span>, AND THE
            CARD WILL NEVER BE EXCHANGED OR REFUNDED
          </li>
          <li>
            Please save your cards into your hard disk, as anything can happen
            anytime.
          </li>
          <li>Be as nice as possible to our staff.</li>
          <li>
            Any negativity to Russian Market staff members may cost you your
            account.
          </li>
          <li>If you cannot connect to our website try changing IP address.</li>
          <li>All purchased cards will be shown in Purchases.</li>
          <li>
            If you&apos;re having any troubles, please double check before
            contacting our support.
          </li>
          <li>
            <span className="font-semibold">NEW-BIES!</span> Please activate
            your account to start purchasing cards.
            <span className="text-red-500 font-semibold">
              {" "}
              DO NOT CONTACT OUR SUPPORT ABOUT ACTIVATION!!!
            </span>
          </li>
        </ol>

        <p className="mt-6 text-lg">
          You can contact our support on Telegram:{" "}
          <span className="font-semibold text-green-400">@JohnZQK</span>
        </p>
      </div>
    </div>
  );
}
