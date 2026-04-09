import React from 'react';
import { motion } from 'motion/react';
import { Users, Building2, GraduationCap, Briefcase } from 'lucide-react';

const stats = [
  { label: 'Students Placed', value: '150+', icon: Users, color: 'text-blue-600' },
  { label: 'Partner Companies', value: '45+', icon: Building2, color: 'text-purple-600' },
  { label: 'Highest Package', value: '12 LPA', icon: Award, color: 'text-yellow-600' },
  { label: 'Placement Rate', value: '85%', icon: GraduationCap, color: 'text-green-600' },
];

import { Award } from 'lucide-react';

export function StatsSection() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 text-center group hover:-translate-y-2 transition-all duration-300"
            >
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <stat.icon className={stat.color} size={32} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-1">{stat.value}</h3>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
