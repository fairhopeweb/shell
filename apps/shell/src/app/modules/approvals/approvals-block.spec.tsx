import { render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { A } from '@cased/test-utilities';
import ApprovalsBlock from './approvals-block';

describe('ApprovalsBlock', () => {
  it('should render multiple approvals successfully', async () => {
    const approvals = [A.approval().withRequestorEmail('iam@a.com').build()];

    const { getByText } = render(
      <ApprovalsBlock emptyText="nope" approvals={approvals} />,
      { wrapper: BrowserRouter },
    );
    await waitFor(() => expect(getByText('iam@a.com')).toBeTruthy());
  });

  it('should render no approvals successfully', async () => {
    const { getByText } = render(
      <ApprovalsBlock emptyText="🐹" approvals={[]} />,
      { wrapper: BrowserRouter },
    );
    await waitFor(() => expect(getByText('🐹')).toBeTruthy());
  });
});
