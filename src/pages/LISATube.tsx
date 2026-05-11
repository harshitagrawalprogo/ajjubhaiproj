import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import { Youtube, Image as ImageIcon, PlayCircle, ExternalLink } from "lucide-react";

export default function LISATube() {
  const [activeTab, setActiveTab] = useState<"videos" | "Photo Gallery">("videos");

  const videos = [
    { id: "ndtYh_rp7yw", title: "SCIENCE PUBLISHING:GREED, VANITY AND THE DECLINE OF SCHOLARSHIP| PROF.P.BALARAM FORMER DIRECTOR IISC", url: "https://www.youtube.com/embed/ndtYh_rp7yw?si=MGraJ_S_P2QoSMjI", speaker: "Prof. P. Balaram" },
    { id: "NmynzuMfG-k", title: "LISACON-2020 INAUGURATION VIDEO - HD", url: "https://www.youtube.com/embed/NmynzuMfG-k?si=V4n3Gt8OMesTawNG", speaker: "Dr PV Konnur President LIS Academy" },
    { id: "E_M_U9r3fzs", title: "Tutorial on Use of Sententia (Lanquill) | Sateesh Hegade | Net Analytiks Technologies", url: "https://www.youtube.com/embed/E_M_U9r3fzs?si=qBn9xnJ8p0mdCqe3", speaker: "Sateesh Hegade" },
    { id: "W3UKhevO6k4", title: "Webinar on Web Design using CMS : DRUPAL | Shivaram B S | LIS Academy | Lecture Series - 12", url: "https://www.youtube.com/embed/W3UKhevO6k4?si=dj02WftKdSiMU6lb", speaker: "Shivaram B. S." },
    { id: "w9EGpiTTgQg", title: "LISACON 2020| Theme 4- Plenary Talk 4- Dr. B. T Sampath kumar", url: "https://www.youtube.com/embed/w9EGpiTTgQg?si=I8FW8_u3xWzktgb1", speaker: "Dr. B. T. Sampath Kumar" },
    { id: "3LpcWjkwv3Y", title: "LISA DISTINGUISHED LECTURE 2 | PROF. ANIL SAHASRABUDHE | CHAIRMAN AICTE", url: "https://www.youtube.com/embed/3LpcWjkwv3Y?si=djGDhTAjuTanb_uc", speaker: "Prof. Anil Sahasrabudhe" },
    { id: "LRAc5OrQgOQ", title: "LISA DISTINGUISHED LECTURE 2 | PRESIDENTIAL ADDRESS | PROF. KARISIDDAPPA, VC, VTU BELAGAVI", url: "https://www.youtube.com/embed/LRAc5OrQgOQ?si=IgUZNiIGx8r0VFWd", speaker: "Prof. Karisiddappa" },
    { id: "Yb3Mk9wreHo", title: "LISACON 2020 | INAUGURAL FUNCTION | Inaugural Address - Prof K K Aggarwal", url: "https://www.youtube.com/embed/Yb3Mk9wreHo?si=0dkQLHn9TnQra1Hz", speaker: "Prof. K. K. Aggarwal" },
    { id: "k8vq9NKTp1Q", title: "LISA INSTITUTE OF ADVANCED STUDIES - Proficiency course on Research Integrity & Scholarly Publishing", url: "https://www.youtube.com/embed/k8vq9NKTp1Q?si=_eoqYHqjSsQ47cxB", speaker: "Dr. BS Shivaram" },
    { id: "Hy1MMJL5yCY", title: "LISACON 2020 | Theme 2- Talk 6 | Dr. B. S. Shivaram", url: "https://www.youtube.com/embed/Hy1MMJL5yCY?si=A7Yhf8RWL-I-Zjlj", speaker: "Dr. B. S. Shivaram" },
    { id: "daIzzATp0ms", title: "LISACON-2020 | INAUGURAL FUNCTION | Guest of Honour - Prof. T.D.Kemparaju,", url: "https://www.youtube.com/embed/daIzzATp0ms?si=OGLwKumW_0LFGMbm", speaker: "Prof. T. D. Kemparaju" },
    { id: "LgFp6bQZhQU", title: "LISACON 4 - Session -3 OPEN OPEN SCIENCE / OPEN DATA : THEME PRESENTATION by Dr  Shamprasad M  Pujar", url: "https://www.youtube.com/embed/LgFp6bQZhQU?si=7WM3_q24GWEAtGph", speaker: "Dr. Shamprasad M. Pujar" },
  ];

  return (
    <PageLayout>
      <PageHeader
        tag=""
        title={
          <>
            LISA Tube
            <span className="block mt-4 text-3xl md:text-4xl lg:text-5xl font-medium text-[#c9a84c]">
              Media Gallery
            </span>
          </>
        }
        description="Explore event highlights, webinars, and special moments from LIS Academy."
      />
      
      <section className="section-padding bg-slate-50 min-h-[60vh]">
        <div className="max-w-7xl mx-auto">
          
          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-white rounded-full p-1 border border-slate-200 shadow-sm">
              <button
                onClick={() => setActiveTab("videos")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  activeTab === "videos" 
                    ? "bg-[#0d1b3e] text-white shadow-md" 
                    : "text-slate-600 hover:text-[#0d1b3e] hover:bg-slate-50"
                }`}
              >
                <Youtube size={18} className={activeTab === "videos" ? "text-red-500" : ""} />
                Videos
              </button>
              <button
                onClick={() => setActiveTab("Photo Gallery")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  activeTab === "Photo Gallery" 
                    ? "bg-[#0d1b3e] text-white shadow-md" 
                    : "text-slate-600 hover:text-[#0d1b3e] hover:bg-slate-50"
                }`}
              >
                <ImageIcon size={18} className={activeTab === "Photo Gallery" ? "text-blue-400" : ""} />
                Photo Gallery
              </button>
            </div>
          </div>

          {/* Content Area */}
          {activeTab === "videos" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                  <h3 className="text-xl font-bold text-[#0d1b3e] flex items-center gap-2">
                    <Youtube className="text-red-600" /> Official YouTube Channel
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">Subscribe for the latest webinars, lectures, and event streams.</p>
                </div>
                <a 
                  href="https://www.youtube.com/@lisacademyindia" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
                >
                  Visit Channel <ExternalLink size={16} />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video, idx) => (
                  <div key={video.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                    <div className="aspect-video bg-slate-100 relative">
                      <iframe 
                        width="100%" 
                        height="100%" 
                        src={video.url} 
                        title={`LIS Academy YouTube Video ${idx + 1}`} 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerPolicy="strict-origin-when-cross-origin" 
                        allowFullScreen
                        className="absolute inset-0"
                      ></iframe>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-slate-800 line-clamp-2 mb-1 group-hover:text-[#c9a84c] transition-colors" title={video.title}>{video.title}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        lisacademyindia 
                        {video.speaker && <span className="text-slate-300 mx-1">•</span>} 
                        {video.speaker && <span className="font-medium text-slate-600">{video.speaker}</span>}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Photo Gallery" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                    <ImageIcon size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-[#0d1b3e] mb-2">Photo Gallery</h3>
                  <p className="text-slate-500 max-w-md">Event photographs and ceremony photos will be uploaded here soon.</p>
               </div>
            </div>
          )}

        </div>
      </section>
    </PageLayout>
  );
}
