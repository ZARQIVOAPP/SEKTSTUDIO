'use client';

import { useState } from 'react';
import { motion } from 'motion/react';

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
    padding: '0.75rem 0',
    color: 'var(--color-text-primary)',
    outline: 'none',
    resize: 'none',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.8rem',
    transition: 'border-color 0.3s ease',
  };

  return (
    <div className="relative mb-8">
      <motion.label
        initial={false}
        animate={{
          y: isFocused || hasValue ? -20 : 12,
          scale: isFocused || hasValue ? 0.85 : 1,
          opacity: isFocused || hasValue ? 0.6 : 0.4,
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-0 origin-left pointer-events-none font-mono"
        style={{
          fontSize: '0.7rem',
          color: 'var(--color-text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {label}
      </motion.label>

      {textarea ? (
        <textarea
          rows={3}
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
    <div
      className="w-full h-full overflow-auto"
      style={{
        padding: '2.5rem',
        backgroundColor: 'var(--color-bg-primary)',
      }}
    >
      {/* Header */}
      <span
        className="font-mono uppercase tracking-widest block"
        style={{
          fontSize: '0.65rem',
          color: 'var(--color-text-secondary)',
          marginBottom: '2rem',
        }}
      >
        006 — LET&apos;S WORK
      </span>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div>
          <h2
            className="font-display font-medium leading-tight"
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              color: 'var(--color-text-primary)',
              marginBottom: '1rem',
            }}
          >
            Have a project<br />in mind?
          </h2>
          <p
            style={{
              fontSize: '0.8rem',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.7,
              maxWidth: '24rem',
            }}
          >
            We collaborate with ambitious brands, artists, and visionaries who refuse to settle for ordinary.
          </p>
        </div>

        {/* Right Column — Form */}
        <div>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col">
            <InputField label="Name" />
            <InputField label="Email" type="email" />
            <InputField label="Project Type" />
            <InputField label="Message" textarea />

            <button
              type="submit"
              className="font-mono uppercase tracking-wider rounded-full transition-colors duration-300 self-start mt-4"
              style={{
                fontSize: '0.65rem',
                padding: '0.75rem 2rem',
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
          </form>
        </div>
      </div>

      {/* Email CTA */}
      <div
        className="w-full text-center"
        style={{
          borderTop: '1px solid var(--color-border)',
          paddingTop: '2rem',
          marginTop: '2.5rem',
        }}
      >
        <a
          href="mailto:hello@sektstudio.com"
          className="font-display font-medium inline-block transition-all duration-500"
          style={{
            fontSize: 'clamp(1rem, 2.5vw, 2.5rem)',
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.02em',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--color-accent)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-text-primary)';
          }}
        >
          hello@sektstudio.com
        </a>
        <p
          className="font-mono uppercase tracking-widest"
          style={{
            fontSize: '0.55rem',
            color: 'var(--color-text-secondary)',
            marginTop: '1rem',
          }}
        >
          Based everywhere. Working globally.
        </p>
      </div>
    </div>
  );
}
