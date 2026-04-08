/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { MessageSection } from "./components/MessageSection";
import { Announcements } from "./components/Announcements";
import { Footer } from "./components/Footer";
import { AICareerAssistant } from "./components/AICareerAssistant";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      <main>
        <Hero />
        <MessageSection />
        <Announcements />
      </main>
      <Footer />
      <AICareerAssistant />
    </div>
  );
}

