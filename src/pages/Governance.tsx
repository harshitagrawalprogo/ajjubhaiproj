import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";

const founderTrustees = [
  {
    name: "Dr. P. V. Konnur",
    role: "President, LIS Academy, Bangalore",
    photo: "/lisa-trustees/pv-konnur.png",
  },
  {
    name: "Dr. S. Srinivasa Ragavan",
    role: "Professor & University Librarian, Bharathidasan University, Trichy",
    photo: "/lisa-trustees/srinivasa-ragavan.jpg",
  },
  {
    name: "Dr. Arun Adrakatti",
    role: "Asst Librarian, National Institute of Technology Calicut, Kozhikode, Kerala",
    photo: "/lisa-trustees/arun-adrakatti.jpg",
  },
  {
    name: "Dr. T. A. Mohan",
    role: "Chief Librarian, Indira Gandhi Institute for Development Research (IGIDR), Mumbai",
    photo: "/lisa-trustees/ta-mohan.jpeg",
  },
  {
    name: "Dr. K. R. Mulla",
    role: "Librarian, MSRIT, Bengaluru",
    photo: "/lisa-trustees/kr-mulla.jpg",
    imagePosition: "center 38%",
  },
  {
    name: "Dr. Manjunatha S",
    role: "Librarian, Government First Grade College, Hoskote",
    photo: "/lisa-trustees/manjunatha-s.jpg",
  },
  {
    name: "Sri. Venkataraju R. S.",
    role: "Former Assistant Director, Prasaranga, BTU Belagavi; Former Asst Librarian, Dept of Public Libraries, Bangalore",
    photo: "/lisa-trustees/venkataraju-rs.jpg",
  },
  {
    name: "Dr. R. S. Wodeyar",
    role: "Deputy Librarian, Central University, Rajasthan",
    photo: "/lisa-trustees/rs-wodeyar.png",
  },
  {
    name: "Dr. Basavaraj S Kumbar",
    role: "Librarian, Gogte Institute of Technology, Belagavi",
    photo: "/lisa-trustees/basavaraj-kumbar.jpg",
  },
  {
    name: "Dr. Shivaram B. S.",
    role: "Head - ICAST, CSIR-National Aerospace Laboratories, Bengaluru",
    photo: "/lisa-trustees/shivaram-bs.jpg",
  },
  {
    name: "Dr. P. Y. Rajendra Kumar",
    role: "Former Director General, National Library of India, Kolkata",
    photo: "/lisa-trustees/py-rajendra-kumar.jpg",
  },
];

const invitedTrustees = [
  {
    name: "Dr. G. Mahesh",
    role: "Principal Scientist, NISCAIR, New Delhi-67",
    photo: "/lisa-trustees/g-mahesh.png",
  },
  {
    name: "Dr. S. M. Pujar",
    role: "Head - ICAST, CSIR-National Aerospace Laboratories, Bengaluru",
    photo: "/lisa-trustees/sm-pujar.jpg",
  },
  {
    name: "Dr. Satish Munnolli",
    role: "Chief Librarian, Advanced Centre for Treatment, Research and Education in Cancer (ACTREC), Navi Mumbai",
    photo: "/lisa-trustees/satish-munnolli.jpg",
  },
];

const advisoryBoard = [
  {
    name: "Dr. Mahendra Jadhav",
    role: "Librarian, IIT Madras, Chennai",
    photo: "/lisa-trustees/mahendra-jadhav.jpg",
  },
  {
    name: "Dr. Bhojaraju Gunjal",
    role: "Head, Central Library, NIT Rourkela, Odisha",
  },
  {
    name: "Dr. S. L. Sangam",
    role: "Former Chairman, Dept of Library & Information Science, Karnatak University, Dharwad",
  },
  {
    name: "Dr. M. G. Sreekumar",
    role: "Vice President & Director, Libraries at Jio Institute, Navi Mumbai, Maharashtra",
    photo: "/lisa-trustees/mg-sreekumar.jpg",
  },
  {
    name: "Dr. Sathish Kumar Hosamani",
    role: "Director, Department of Public Libraries, Bangalore",
  },
  {
    name: "Dr. Suresh Jange",
    role: "University Librarian, Gulbarga University, Kalaburagi",
  },
  {
    name: "Dr. Bibhuti Bhusan Sahoo",
    role: "Deputy Librarian, IIT Bhubaneswar, Odisha",
    photo: "/lisa-trustees/bibhuti-sahoo.jpg",
  },
];

const tabs = [
  { id: "founder", label: "Founder Trustees", data: founderTrustees },
  { id: "invited", label: "Invited Trustees", data: invitedTrustees },
  { id: "advisory", label: "Advisory Board", data: advisoryBoard },
];

function getInitials(name: string) {
  return name
    .replace(/^Dr\.\s*|^Sri\.\s*/i, "") // Remove titles
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function MemberCard({ member, index }: { member: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col"
    >
      <div className="h-2 w-full bg-[#c0392b] transition-all duration-300"></div>
      <div className="p-7 flex flex-col items-center flex-1 text-center">
        <div className="w-36 h-36 md:w-40 md:h-40 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-serif text-4xl mb-5 border-4 border-white shadow-md overflow-hidden relative">
          {member.photo ? (
            <img
              src={member.photo}
              alt={member.name}
              className="h-full w-full object-cover"
              style={{ objectPosition: member.imagePosition || "center center" }}
            />
          ) : (
            <>
              <span className="absolute inset-0 bg-gradient-to-br from-[#c9a84c]/20 to-transparent"></span>
              <span className="relative font-bold text-[#0d1b3e]">
                {getInitials(member.name)}
              </span>
            </>
          )}
        </div>
        <h3 className="font-serif text-lg font-bold text-[#0d1b3e] mb-2">
          {member.name}
        </h3>
        <p className="text-sm text-slate-600 font-medium leading-snug">
          {member.role}
        </p>
      </div>
    </motion.div>
  );
}

export default function Governance() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const activeData = tabs.find((t) => t.id === activeTab)?.data || [];

  return (
    <PageLayout>
      <PageHeader
        tag="Governance"
        title="Our Leadership"
        description="The esteemed professionals guiding the vision and mission of LIS Academy."
      />

      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Subpage Tabs */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-16">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-[#0d1b3e] text-white shadow-md"
                    : "bg-white text-slate-600 hover:bg-slate-200 shadow-sm"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {activeData.map((member, index) => (
                <MemberCard key={member.name} member={member} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </PageLayout>
  );
}
