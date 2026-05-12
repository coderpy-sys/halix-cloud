import { useStoreState } from '@/state'
import {
    ArrowRightIcon,
    CircleStackIcon,
    CpuChipIcon,
    GlobeAltIcon,
    KeyIcon,
    MapPinIcon,
    ServerStackIcon,
    UserGroupIcon,
} from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

import PageContentBlock from '@/components/elements/PageContentBlock'

const quickLinks = [
    {
        to: '/admin/locations',
        title: 'Locations',
        blurb: 'Regions and placement groups for nodes.',
        icon: MapPinIcon,
    },
    {
        to: '/admin/nodes',
        title: 'Nodes',
        blurb: 'Proxmox nodes, templates, ISOs, and capacity.',
        icon: CpuChipIcon,
    },
    {
        to: '/admin/servers',
        title: 'Servers',
        blurb: 'Customer VMs, builds, and lifecycle controls.',
        icon: ServerStackIcon,
    },
    {
        to: '/admin/ipam',
        title: 'IPAM',
        blurb: 'Address pools and network assignments.',
        icon: GlobeAltIcon,
    },
    {
        to: '/admin/users',
        title: 'Users',
        blurb: 'Accounts, roles, and access.',
        icon: UserGroupIcon,
    },
    {
        to: '/admin/tokens',
        title: 'API tokens',
        blurb: 'Automation keys for the application API.',
        icon: KeyIcon,
    },
] as const

const OverviewContainer = () => {
    const version = useStoreState(state => state.settings.data!.version)

    return (
        <PageContentBlock title='Overview'>
            <div className='space-y-8'>
                <div className='rounded-2xl border border-accent-300/40 bg-accent-2/60 dark:bg-accent-2/40 p-6 sm:p-8 shadow-[0_0_0_1px_rgba(167,139,250,0.08)] backdrop-blur-sm'>
                    <p className='text-xs font-semibold uppercase tracking-[0.2em] text-accent-500 mb-2'>
                        Halix Cloud
                    </p>
                    <h1 className='text-2xl sm:text-3xl font-bold text-foreground tracking-tight'>
                        Administration
                    </h1>
                    <p className='mt-3 text-accent-600 max-w-2xl leading-relaxed'>
                        Manage your infrastructure from one place. Pick a section
                        below or use the top navigation. Panel version{' '}
                        <span className='font-mono text-accent-500'>{version}</span>
                        .
                    </p>
                </div>

                <div>
                    <h2 className='text-sm font-semibold uppercase tracking-wide text-accent-500 mb-4 flex items-center gap-2'>
                        <CircleStackIcon className='w-5 h-5' />
                        Quick access
                    </h2>
                    <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
                        {quickLinks.map(({ to, title, blurb, icon: Icon }) => (
                            <Link
                                key={to}
                                to={to}
                                className='group relative flex flex-col rounded-xl border border-accent-300/35 bg-background/80 dark:bg-accent-1/50 p-5 transition-all hover:border-violet-500/50 hover:shadow-[0_8px_30px_-12px_rgba(109,40,217,0.45)]'
                            >
                                <div className='flex items-start justify-between gap-3'>
                                    <div className='rounded-lg bg-accent-2/80 p-2.5 text-accent-500 ring-1 ring-accent-300/30'>
                                        <Icon className='h-6 w-6' />
                                    </div>
                                    <ArrowRightIcon className='h-5 w-5 text-accent-400 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100' />
                                </div>
                                <h3 className='mt-4 text-lg font-semibold text-foreground'>
                                    {title}
                                </h3>
                                <p className='mt-1.5 text-sm text-accent-600 leading-snug'>
                                    {blurb}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </PageContentBlock>
    )
}

export default OverviewContainer
