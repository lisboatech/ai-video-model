"use client"

import React from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "../../../components/ui/sidebar"
import Image from 'next/image'
import { Button } from '../../../components/ui/button'
import { LayoutDashboard, Settings2Icon, Video, Videotape, WalletCards } from 'lucide-react'
import { useParams, usePathname } from 'next/navigation'

const MenuOptions=[
    {
        title: 'Início',
        icon: LayoutDashboard,
        path: '/workspace'
    },
    {
        title: 'Criar Experiência',
        icon: Video,
        path: '/workspace/create-experience'
    },
    {
        title: 'Minhas Experiências',
        icon: Videotape,
        path: '/workspace/my-experiences'
    }
]

export function AppSidebar() {

    const path=usePathname();
    console.log(path);

    return (
        <Sidebar>
            <SidebarHeader className={'flex items-center my-5'}>
                <Image src={'/logo.svg'} alt='logo' width={200} height={200}/>
            </SidebarHeader>
            <hr />
            <SidebarContent>
                <SidebarGroup>
                    <Button className={'mt-5 bg-primary hover:bg-primary/90'}>+ Criar Nova Experiência</Button>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Menu</SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu>
                            {MenuOptions.map((menu, index)=> (
                                <SidebarMenuItem key={index}>
                                    <SidebarMenuButton asChild className={'p-5'}>
                                        <a
                                            href={menu.path}
                                            className={`text-[17px] ${path==menu.path&&'text-primary bg-blue-100'}`}

                                        >
                                            <menu.icon className='h-10 w-10'/>
                                            <span>{menu.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}

export default AppSidebar