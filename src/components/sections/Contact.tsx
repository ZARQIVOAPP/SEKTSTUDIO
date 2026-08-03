'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { MagneticButton } from '../motion/MagneticButton';
import { ScrollReveal } from '../motion/ScrollReveal';

interface InputFieldProps {
  label: string;
  type?: string;
  textarea?: boolean;
}

function InputField({ label, type = 'text', textarea = false }: InputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsFocused(false);
    setHasValue(e.target.value.length > 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setHasValue(e.target.value.length > 0);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: 'transparent',
    borderBottom: `1px solid ${isFocused ? 'var(--color-text-secondary)' : 'var(--color-border)'}`,
    padding: '1rem 0',
    color: 'var(--color-text-primary)',
    outline: 'none',
    resize: 'none',
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-body)',
    transition: 'border-color 0.3s ease',
  };

  return (
    <div className="relative mb-12">
      <motion.label
        initial={false}
        animate={{
          y: isFocused || hasValue ? -24 : 16,
          scale: isFocused || hasValue ? 0.85 : 1,
          opacity: isFocused || hasValue ? 0.6 : 0.4,
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-0 origin-left pointer-events-none font-mono"
        style={{
          fontSize: 'var(--text-caption)',
          color: 'var(--color-text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {label}
      </motion.label>

      {textarea ? (
        <textarea
          rows={4}
          style={inputStyle}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          onChange={handleChange}
          aria-label={label}
        />
      ) : (
        <input
          type={type}
          style={inputStyle}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          onChange={handleChange}
          aria-label={label}
        />
      )}
    </div>
  );
}

export function Contact() {
  return (
    <section
      id="contact"
      style={{
        paddingTop: 'var(--space-section)',
        paddingBottom: 'var(--space-lg)',
        paddingLeft: 'var(--grid-margin)',
        paddingRight: 'var(--grid-margin)',
      }}
    >
      <ScrollReveal>
        <span
          className="font-mono uppercase tracking-widest block"
          style={{
            fontSize: 'var(--text-caption)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-xl)',
          }}
        >
          007 — LET&apos;S WORK
        </span>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8" style={{ marginBottom: 'var(--space-xl)' }}>
        {/* Left Column */}
        <div className="lg:col-span-5">
          <ScrollReveal delay={0.1}>
            <h2
              className="font-display font-medium leading-tight"
              style={{
                fontSize: 'var(--text-display-md)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-md)',
              }}
            >
              Have a project<br />in mind?
            </h2>
            <p
              style={{
                fontSize: 'var(--text-body)',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.7,
                maxWidth: '28rem',
              }}
            >
              We collaborate with ambitious brands, artists, and visionaries who refuse to settle for ordinary.
            </p>
          </ScrollReveal>
        </div>

        {/* Right Column — Form */}
        <div className="lg:col-span-5 lg:col-start-8">
          <ScrollReveal delay={0.2}>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col">
              <InputField label="Name" />
              <InputField label="Email" type="email" />
              <InputField label="Project Type" />
              <InputField label="Message" textarea />

              <div className="mt-8 self-start">
                <MagneticButton>
                  <button
                    type="submit"
                    className="font-mono uppercase tracking-wider rounded-full transition-colors duration-300"
                    style={{
                      fontSize: 'var(--text-caption)',
                      padding: '1rem 2.5rem',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-primary)',
                      backgroundColor: 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-text-primary)';
                      e.currentTarget.style.color = 'var(--color-bg-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--color-text-primary)';
                    }}
                  >
                    Send Inquiry
                  </button>
                </MagneticButton>
              </div>
            </form>
          </ScrollReveal>
        </div>
      </div>

      {/* Massive Email */}
      <ScrollReveal delay={0.3}>
        <div
          className="w-full text-center"
          style={{
            borderTop: '1px solid var(--color-border)',
            paddingTop: 'var(--space-xl)',
          }}
        >
          <a
            href="mailto:hello@sektstudio.com"
            className="font-display font-medium inline-block transition-all duration-500"
            style={{
              fontSize: 'clamp(1.5rem, 5vw, 5rem)',
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.02em',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.color = 'var(--color-accent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.color = 'var(--color-text-primary)';
            }}
          >
            hello@sektstudio.com
          </a>
          <p
            className="font-mono uppercase tracking-widest"
            style={{
              fontSize: 'var(--text-micro)',
              color: 'var(--color-text-secondary)',
              marginTop: 'var(--space-md)',
            }}
          >
            Based everywhere. Working globally.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
