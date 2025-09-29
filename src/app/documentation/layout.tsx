import { DocsLayout, type DocsLayoutProps } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider";
import type { ReactNode } from "react";
import { baseOptions } from "~/app/layout.config";
import { source } from "~/libs/source";
import { DocsThemeHandler } from "~/components/docs/docs-theme-handler";
import { DocsRouteHandler } from "~/components/docs/docs-route-handler";
import "fumadocs-ui/css/ocean.css";
import "fumadocs-ui/css/preset.css";

const docsOptions: DocsLayoutProps = {
    ...baseOptions,
    tree: source.pageTree,
};

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <main>
            <DocsRouteHandler />
            <div className="docs-isolated-container relative">
                <DocsThemeHandler />
                <RootProvider>
                    <DocsLayout {...docsOptions}>{children}</DocsLayout>
                </RootProvider>
            </div>
        </main>
    );
}
