import React, { useState } from 'react'
import { Tabs } from './Tabs'
import { ProposalList } from './ProposalList'
import { CreateProposal } from './CreateProposal'
import { MemberManagement } from './MemberManagement'

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('proposals')

  const tabs = [
    { id: 'proposals', label: 'Proposals' },
    { id: 'create', label: 'Create Proposal' },
    { id: 'members', label: 'Members' },
  ]

  return (
    <div>
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="mt-6">
        {activeTab === 'proposals' && <ProposalList />}
        {activeTab === 'create' && <CreateProposal />}
        {activeTab === 'members' && <MemberManagement />}
      </div>
    </div>
  )
}
