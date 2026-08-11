import { motion } from 'framer-motion'
import { Gamepad2, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function TermsPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/60">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button whileHover={{ x: -3 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-500" />
            </motion.button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #a855f7, #22d3ee)' }}>
                <Gamepad2 className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-bold text-gray-800" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                DREAMLAND ARCADE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            Terms and Conditions
          </h1>
          <p className="text-sm text-gray-400 mb-8" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            Last updated: August 11, 2026
          </p>

          <div className="space-y-6 text-[15px] text-gray-600 leading-relaxed" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            <section>
              <h2 className="text-lg font-bold text-gray-800 mb-2" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '16px' }}>
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing and using the Dreamland Arcade Membership Management System ("the System"),
                you agree to be bound by these Terms and Conditions. If you do not agree to any part
                of these terms, you may not access or use the System. These terms apply to all users,
                including members, staff, and administrators.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-800 mb-2" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '16px' }}>
                2. Membership Program
              </h2>
              <p className="mb-2">
                The Dreamland Arcade Membership Program ("the Program") is a loyalty rewards system
                offered by Dreamland Arcade. The Program includes the following membership tiers:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Qualifier</strong> — Entry-level membership issued upon registration.</li>
                <li><strong>Silver</strong> — Earned upon accumulating 1,000 points. Entitles the member to a 5% discount on token purchases of ₱150 or more, plus 100 bonus tokens upon tier upgrade.</li>
                <li><strong>Gold</strong> — Earned upon accumulating 3,500 points. Entitles the member to a 10% discount on token purchases of ₱150 or more, plus 150 bonus tokens upon tier upgrade.</li>
                <li><strong>Black</strong> — Earned upon accumulating 5,500 points. Entitles the member to a 15% discount on token purchases of ₱150 or more, plus 250 bonus tokens upon tier upgrade.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-800 mb-2" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '16px' }}>
                3. Points and Rewards
              </h2>
              <p>
                Points are earned when members purchase token packages at Dreamland Arcade. The number
                of points earned varies by package. Points are non-transferable, have no monetary value,
                and cannot be exchanged for cash. Points are tracked through the member's card and may
                be reviewed at any time through the System. Dreamland Arcade reserves the right to
                modify the points structure at any time with reasonable notice to members.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-800 mb-2" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '16px' }}>
                4. Discount Policy
              </h2>
              <p>
                Discounts apply only to token purchases with a minimum transaction amount of ₱150.
                Discounts are calculated based on the member's current tier and are applied at the
                point of sale. Discounts cannot be combined with other promotions or offers unless
                explicitly stated. Dreamland Arcade reserves the right to modify discount rates with
                reasonable notice.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-800 mb-2" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '16px' }}>
                5. Member Responsibilities
              </h2>
              <p className="mb-2">Members are responsible for:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Maintaining the confidentiality of their membership card and card ID.</li>
                <li>Providing accurate and up-to-date personal information during registration.</li>
                <li>Notifying Dreamland Arcade immediately if their card is lost, stolen, or compromised.</li>
                <li>Using their membership card only for its intended purpose and in compliance with these terms.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-800 mb-2" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '16px' }}>
                6. Card Replacement
              </h2>
              <p>
                Lost or stolen cards may be reported to Dreamland Arcade staff for deactivation and
                replacement. A replacement card will be issued with the member's existing tier status
                and points balance intact. Dreamland Arcade is not responsible for any unauthorized
                use of a card prior to its reported loss or theft.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-800 mb-2" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '16px' }}>
                7. Data Privacy
              </h2>
              <p>
                Dreamland Arcade collects and processes personal information in accordance with the
                Data Privacy Act of 2012 (Republic Act No. 10173) and its implementing rules and
                regulations. Personal data collected through the System is used solely for the purpose
                of administering the membership program, improving services, and communicating with
                members regarding their accounts and promotions. Dreamland Arcade implements appropriate
                organizational and technical security measures to protect personal data against
                unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-800 mb-2" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '16px' }}>
                8. Limitation of Liability
              </h2>
              <p>
                Dreamland Arcade shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages arising out of or related to the use of the System
                or participation in the Program. The System is provided "as is" without warranties of
                any kind, either express or implied. Dreamland Arcade does not guarantee uninterrupted
                or error-free operation of the System.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-800 mb-2" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '16px' }}>
                9. Modifications and Termination
              </h2>
              <p>
                Dreamland Arcade reserves the right to modify, suspend, or terminate the Program or
                these Terms and Conditions at any time. Material changes will be communicated to
                members through the System or via registered contact information. Continued use of
                the System following any changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-800 mb-2" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '16px' }}>
                10. Governing Law
              </h2>
              <p>
                These Terms and Conditions shall be governed by and construed in accordance with the
                laws of the Republic of the Philippines. Any disputes arising under or in connection
                with these terms shall be subject to the exclusive jurisdiction of the courts of the
                Philippines.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-800 mb-2" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '16px' }}>
                11. Contact Information
              </h2>
              <p>
                For questions, concerns, or requests related to these Terms and Conditions or the
                membership program, please contact Dreamland Arcade management through any of the
                following channels:
              </p>
              <div className="mt-2 ml-4 space-y-1">
                <p>Email: support@dreamlandarcade.com</p>
                <p>Phone: (02) 8888-8888</p>
                <p>Address: Dreamland Arcade, Metro Manila, Philippines</p>
              </div>
            </section>
          </div>

          {/* Back button */}
          <div className="mt-10 pt-6 border-t border-gray-100">
            <button onClick={() => navigate(-1)}
              className="text-sm font-semibold text-indigo-500 hover:text-indigo-600 transition-colors"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              ← Back to Login
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
