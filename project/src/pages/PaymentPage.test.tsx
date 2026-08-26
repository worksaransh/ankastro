import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mocks must be declared before importing the component under test.
const invokeMock = vi.fn();
const toastErrorMock = vi.fn();
const toastSuccessMock = vi.fn();
const navigateMock = vi.fn();

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: {
          session: {
            user: {
              id: 'user-123',
              email: 'test@example.com',
              user_metadata: { full_name: 'Test User', phone_number: '' },
            },
          },
        },
      }),
    },
    functions: { invoke: (...args: any[]) => invokeMock(...args) },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: { message: 'not found' } }),
    })),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    error: (...a: any[]) => toastErrorMock(...a),
    success: (...a: any[]) => toastSuccessMock(...a),
  },
  Toaster: () => null,
}));

vi.mock('react-router-dom', async () => {

  const actual: any = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => navigateMock };
});

vi.mock('@/contexts/LanguageContext', () => ({
  useLanguage: () => ({ language: 'en', setLanguage: vi.fn() }),
  LanguageProvider: ({ children }: any) => children,
}));

vi.mock('@/components/SEO', () => ({ default: () => null }));
vi.mock('@/components/LanguageToggle', () => ({ default: () => null }));
vi.mock('@/components/Logo', () => ({ Logo: () => null }));

import PaymentPage from './PaymentPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderPage = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/payment?tier=pro']}>
        <PaymentPage />
      </MemoryRouter>
    </QueryClientProvider>
  );

const clickPay = async () => {
  const btn = await screen.findByRole('button', { name: /Pay Now/i });
  fireEvent.click(btn);
};

describe('PaymentPage error surfacing', () => {
  beforeEach(() => {
    invokeMock.mockReset();
    toastErrorMock.mockReset();
    toastSuccessMock.mockReset();
    navigateMock.mockReset();
  });

  it('shows server error message when create-payment returns success:false (HTTP 200)', async () => {
    invokeMock.mockResolvedValue({
      data: { success: false, error: 'Invalid coupon code', code: 'INVALID_COUPON' },
      error: null,
    });
    renderPage();
    await clickPay();
    await waitFor(() => expect(toastErrorMock).toHaveBeenCalledWith('Invalid coupon code'));
  });

  it('shows parsed error body when invoke returns a FunctionsError (non-2xx)', async () => {
    const fakeResponse = new Response(
      JSON.stringify({ success: false, error: 'Upgrade not available' }),
      { status: 400 }
    );
    invokeMock.mockResolvedValue({
      data: null,
      error: { name: 'FunctionsHttpError', message: 'Edge Function returned a non-2xx status code', status: 400, context: fakeResponse },
    });
    renderPage();
    await clickPay();
    await waitFor(() => expect(toastErrorMock).toHaveBeenCalledWith('Upgrade not available'));
  });

  it('falls back to generic message when error body cannot be parsed', async () => {
    invokeMock.mockResolvedValue({
      data: null,
      error: { name: 'FunctionsHttpError', message: 'Boom', status: 500 },
    });
    renderPage();
    await clickPay();
    await waitFor(() => expect(toastErrorMock).toHaveBeenCalledWith('Boom'));
  });

  it('does not show an error toast on successful paid response', async () => {
    invokeMock.mockResolvedValue({
      data: { success: true, orderId: 'ord_1', paymentLink: 'https://pay.example/ord_1' },
      error: null,
    });
    const hrefSpy = vi.spyOn(window, 'location', 'get').mockReturnValue({
      ...window.location,
      assign: vi.fn(),
      href: '',
    } as any);
    renderPage();
    await clickPay();
    await waitFor(() => expect(invokeMock).toHaveBeenCalled());
    expect(toastErrorMock).not.toHaveBeenCalled();
    hrefSpy.mockRestore();
  });
});
