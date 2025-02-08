"use client";

import {
  Code2,
  Database,
  FileCode,
  List,
  Settings,
  Share2,
  Wrench,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function CodeSidebar() {
  return (
    <Sidebar
      className="w-[60px] border-r border-zinc-800 bg-zinc-950"
      collapsible="none"
    >
      <SidebarHeader className="h-[60px] border-b border-zinc-800">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-12 w-full justify-center bg-transparent hover:bg-zinc-800"
              tooltip="Home"
            >
              <FileCode className="h-5 w-5 text-zinc-400" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-12 w-full justify-center bg-transparent hover:bg-zinc-800/50"
              tooltip="Code"
              isActive
            >
              <Code2 className="h-5 w-5 text-zinc-400" />
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-12 w-full justify-center bg-transparent hover:bg-zinc-800/50"
              tooltip="Share"
            >
              <Share2 className="h-5 w-5 text-zinc-400" />
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-12 w-full justify-center bg-transparent hover:bg-zinc-800/50"
              tooltip="Files"
            >
              <List className="h-5 w-5 text-zinc-400" />
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-12 w-full justify-center bg-transparent hover:bg-zinc-800/50"
              tooltip="Database"
            >
              <Database className="h-5 w-5 text-zinc-400" />
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-12 w-full justify-center bg-transparent hover:bg-zinc-800/50"
              tooltip="Debug"
            >
              <Wrench className="h-5 w-5 text-zinc-400" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mt-auto pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-12 w-full justify-center bg-transparent hover:bg-zinc-800/50"
              tooltip="Settings"
            >
              <Settings className="h-5 w-5 text-zinc-400" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
