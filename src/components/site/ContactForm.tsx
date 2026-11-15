'use client';

import { useState, type FormEvent } from 'react';
import {
  COMPANY_SIZES,
  CONTACT_COPY,
  INQUIRY_FIELDS,
  INQUIRY_TYPES,
  type InquiryFieldName,
  type InquiryType,
} from '@/content/contact';
import { PRIVACY_NOTICE } from '@/content/privacy-notice';
import { submitInquiry, type InquiryResult, type SubmitInquiry } from '@/lib/inquiry/adapter';
import { validateInquiry, type InquiryErrors } from '@/lib/inquiry/schema';
import PrivacyNotice from './PrivacyNotice';

interface FormValues {
  name: string;
  email: string;
  company: string;
  companySize: string;
  inquiryType: string;
  headcount: string;
  message: string;
  consent: boolean;
}

const FIELD_ORDER: Array<keyof FormValues> = [
  'name',
  'email',
  'company',
  'companySize',
  'inquiryType',
  'headcount',
  'message',
  'consent',
];

function emptyValues(inquiryType: InquiryType | ''): FormValues {
  return {
    name: '',
    email: '',
    company: '',
    companySize: '',
    inquiryType,
    headcount: '',
    message: '',
    consent: false,
  };
}

const fieldId = (name: keyof FormValues) => `inquiry-${name}`;
const errorId = (name: keyof FormValues) => `inquiry-${name}-error`;

interface Props {
  /** 預選的需求類型（例如從 /contact?type=training 帶入） */
  initialType?: InquiryType | '';
  /** 可替換的送出 adapter；M1 預設為 mock（測試模式） */
  submit?: SubmitInquiry;
}

/** 預約諮詢表單（M1 AC-004、AC-005）。 */
export default function ContactForm({ initialType = '', submit = submitInquiry }: Props) {
  const [values, setValues] = useState<FormValues>(() => emptyValues(initialType));
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<InquiryResult | null>(null);

  const update = <K extends keyof FormValues>(name: K, value: FormValues[K]) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const validation = validateInquiry(values);
    if (!validation.ok) {
      setErrors(validation.errors);
      setResult(null);
      const firstInvalid = FIELD_ORDER.find((name) => validation.errors[name]);
      if (firstInvalid) document.getElementById(fieldId(firstInvalid))?.focus();
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      const outcome = await submit(validation.data);
      setResult(outcome);
      // 送出後立即清空表單，不在畫面或記憶體中保留個資
      if (outcome.ok) setValues(emptyValues(''));
    } catch {
      setResult({ ok: false, message: '送出時發生問題，請稍後再試。' });
    } finally {
      setSubmitting(false);
    }
  };

  if (result?.ok) {
    const isTestMode = result.mode === 'test' || !result.delivered;
    return (
      <div
        role="status"
        aria-live="polite"
        data-testid="inquiry-success"
        data-mode={result.mode}
        className="card-soft p-6 md:p-8"
      >
        <span className="badge badge-warning mb-3">{isTestMode ? '測試模式' : '已送出'}</span>
        <h2 className="text-h4">{isTestMode ? CONTACT_COPY.successTitle : '已收到你的預約'}</h2>
        {isTestMode && <p className="text-body mt-3">{CONTACT_COPY.successBody}</p>}
        <button type="button" className="btn btn-secondary mt-5" onClick={() => setResult(null)}>
          {CONTACT_COPY.resetLabel}
        </button>
      </div>
    );
  }

  const textField = (name: Extract<InquiryFieldName, 'name' | 'email' | 'company' | 'headcount'>) => {
    const field = INQUIRY_FIELDS[name];
    const inputProps = {
      name: { type: 'text', autoComplete: 'name' },
      email: { type: 'email', autoComplete: 'email', inputMode: 'email' as const },
      company: { type: 'text', autoComplete: 'organization' },
      headcount: { type: 'text', autoComplete: 'off', inputMode: 'numeric' as const },
    }[name];
    return (
      <div className="site-field">
        <label htmlFor={fieldId(name)}>
          {field.label}
          {field.required ? <RequiredMark /> : <span className="site-optional">（選填）</span>}
        </label>
        <input
          id={fieldId(name)}
          name={name}
          className="input"
          value={values[name]}
          placeholder={field.placeholder}
          required={field.required}
          aria-required={field.required}
          aria-invalid={errors[name] ? true : undefined}
          aria-describedby={errors[name] ? errorId(name) : undefined}
          onChange={(event) => update(name, event.target.value)}
          {...inputProps}
        />
        <FieldError id={errorId(name)} message={errors[name]} />
      </div>
    );
  };

  const selectField = (
    name: 'companySize' | 'inquiryType',
    options: ReadonlyArray<{ value: string; label: string }>,
  ) => {
    const field = INQUIRY_FIELDS[name];
    return (
      <div className="site-field">
        <label htmlFor={fieldId(name)}>
          {field.label}
          <RequiredMark />
        </label>
        <select
          id={fieldId(name)}
          name={name}
          className="input"
          value={values[name]}
          required
          aria-required
          aria-invalid={errors[name] ? true : undefined}
          aria-describedby={errors[name] ? errorId(name) : undefined}
          onChange={(event) => update(name, event.target.value)}
        >
          <option value="">{field.placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <FieldError id={errorId(name)} message={errors[name]} />
      </div>
    );
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      aria-label={CONTACT_COPY.title}
      data-testid="inquiry-form"
      className="space-y-5"
    >
      <p className="site-test-banner" data-testid="inquiry-test-banner">
        {CONTACT_COPY.testModeBanner}
      </p>

      <PrivacyNotice />

      <div className="grid gap-5 md:grid-cols-2">
        {textField('name')}
        {textField('email')}
        {textField('company')}
        {selectField('companySize', COMPANY_SIZES)}
        {selectField('inquiryType', INQUIRY_TYPES)}
        {textField('headcount')}
      </div>

      <div className="site-field">
        <label htmlFor={fieldId('message')}>
          {INQUIRY_FIELDS.message.label}
          <RequiredMark />
        </label>
        <textarea
          id={fieldId('message')}
          name="message"
          rows={5}
          className="input site-textarea"
          value={values.message}
          placeholder={INQUIRY_FIELDS.message.placeholder}
          required
          aria-required
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? errorId('message') : undefined}
          onChange={(event) => update('message', event.target.value)}
        />
        <FieldError id={errorId('message')} message={errors.message} />
      </div>

      <div className="site-field">
        <label htmlFor={fieldId('consent')} className="site-checkbox">
          <input
            id={fieldId('consent')}
            name="consent"
            type="checkbox"
            checked={values.consent}
            required
            aria-required
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? errorId('consent') : 'privacy-notice'}
            onChange={(event) => update('consent', event.target.checked)}
          />
          <span>
            {PRIVACY_NOTICE.consentLabel}
            <RequiredMark />
          </span>
        </label>
        <FieldError id={errorId('consent')} message={errors.consent} />
      </div>

      {result && !result.ok && (
        <p role="alert" className="site-error" data-testid="inquiry-submit-error">
          {result.message}
        </p>
      )}

      <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
        {submitting ? '送出中…' : CONTACT_COPY.submitLabel}
      </button>
    </form>
  );
}

function RequiredMark() {
  return (
    <>
      <span aria-hidden="true" className="text-[var(--danger)]">
        {' '}
        *
      </span>
      <span className="sr-only">（必填）</span>
    </>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="site-error">
      {message}
    </p>
  );
}
