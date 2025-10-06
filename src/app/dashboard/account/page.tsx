"use client";
import AccountAddress from "~/components/account/address";
import AccountInfomation from "~/components/account/infomation";
import AccountMeta from "~/components/account/meta";

export default function Profile() {
    return (
        <div>
            <div className="rounded-2xl border  p-5  lg:p-6">
                <h3 className="mb-5 text-lg font-semibold text-blue-800 dark:text-blue-100 lg:mb-7">Profile</h3>
                <div className="space-y-6">
                    <AccountMeta />
                    <AccountInfomation />
                    <AccountAddress />
                </div>
            </div>
        </div>
    );
}
