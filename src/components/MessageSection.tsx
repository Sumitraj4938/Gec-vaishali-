import { Card, CardContent } from "@/components/ui/card";
import { motion } from "motion/react";
import React from "react";

interface MessageCardProps {
  image: string;
  name: string;
  title: string;
  message: string;
  reverse?: boolean;
}

export function MessageSection() {
  const messages: MessageCardProps[] = [
    {
      name: "DR. ANANT KUMAR",
      title: "Message by Principal Sir",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=500",
      message: "It gives me immense pleasure to welcome you to the Training and Placement Portal. Our institution is deeply committed to academic excellence, innovation, and the holistic development of every student. This Portal defines the professional trajectory of our students, ensuring they are not just degree holders but industry-ready leaders prepared for global challenges.",
      reverse: false
    },
    {
      name: "MR. MUKESH KUMAR ROY",
      title: "Message by HOD Sir",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=500",
      message: "It gives me immense pleasure to welcome you to the Training and Placement Portal. Our institution is deeply committed to academic excellence, innovation, and the holistic development of every student. This Portal defines the professional trajectory of our students, ensuring they are not just degree holders but industry-ready leaders prepared for global challenges.",
      reverse: true
    },
    {
      name: "MRS. SHIVANGI SAXENA",
      title: "Message by TPO Head",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=500",
      message: "Our mission is to guide students toward fulfilling careers by providing high-end technical training and intensive skill development. Through this Portal, we connect our talent pool with industry giants. We work tirelessly to ensure our students possess both technical prowess and the soft skills required to thrive in professional corporate environments.",
      reverse: true
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 space-y-16">
        {messages.map((msg, index) => (
          <MessageCard 
            key={`msg-${index}`} 
            {...msg}
          />
        ))}
      </div>
    </section>
  );
}

const MessageCard: React.FC<MessageCardProps> = ({ image, name, title, message, reverse = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: reverse ? 50 : -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <Card className={`overflow-hidden border-none shadow-xl bg-slate-50 rounded-3xl ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} flex flex-col`}>
        <div className="md:w-1/3 h-80 md:h-auto relative">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 to-transparent p-6 text-white">
            <p className="font-bold text-xl">{name}</p>
          </div>
        </div>
        <div className={`md:w-2/3 p-8 md:p-12 flex flex-col justify-center relative ${reverse ? 'border-r-4' : 'border-l-4'} border-yellow-400`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-1 w-12 bg-yellow-400 rounded-full"></div>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 italic">{title}</h3>
          </div>
          <p className="text-slate-600 leading-relaxed text-lg italic">
            {message}
          </p>
        </div>
      </Card>
    </motion.div>
  );
};
