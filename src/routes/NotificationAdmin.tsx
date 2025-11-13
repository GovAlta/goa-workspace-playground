import {useNotifications} from "../contexts/NotificationContext";
import {useState} from "react";
import {
    GoabButton,
    GoabCheckbox, GoabDropdown, GoabDropdownItem,
    GoabFormItem,
    GoabInput,
    GoabPageBlock,
    GoabRadioGroup,
    GoabRadioItem
} from "@abgov/react-components";
import {PageHeader} from "../components/PageHeader";
import {
    GoabBadgeType,
    GoabCheckboxOnChangeDetail, GoabDropdownOnChangeDetail,
    GoabInputOnChangeDetail,
    GoabRadioGroupOnChangeDetail
} from "@abgov/ui-components-common";
import {WorkSideNotificationType} from "@abgov/react-components/experimental";

export const NotificationAdmin = () => {
    const {addNotification} = useNotifications();

    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [type, setType] = useState<WorkSideNotificationType>('default');
    const [isUrgent, setIsUrgent] = useState(false);
    const [badgeType, setBadgeType] = useState<string>('');
    const [badgeContent, setBadgeContent] = useState<string>('');

    const submit = () => {
        if (description?.length === 0) return;
        addNotification({
            title,
            description,
            type,
            timestamp: new Date(),
            isUrgent,
            isRead: false,
            badgeType: badgeType as GoabBadgeType,
            badgeContent: badgeContent || undefined,
        })

        //reset form
        setTitle("");
        setDescription("");
        setType("default");
        setIsUrgent(false);
        setBadgeType("");
        setBadgeContent("");
    }

    return (
        <>
            <GoabPageBlock width="full">
                <PageHeader title="Add new notification"></PageHeader>
                <GoabFormItem label="Title" requirement={"optional"}>
                    <GoabInput name="title" value={title} onChange={(e: GoabInputOnChangeDetail) => setTitle(e.value)} />
                </GoabFormItem>
                <GoabFormItem label="Description" requirement={"required"}>
                    <GoabInput name="description" value={description} onChange={(e: GoabInputOnChangeDetail) => setDescription(e.value)}/>
                </GoabFormItem>
                <GoabFormItem label="Notification Type">
                    <GoabRadioGroup name="type" value={type} onChange={(e: GoabRadioGroupOnChangeDetail) => setType(e.value)}>
                        <GoabRadioItem value={"default"} label={"Default"}></GoabRadioItem>
                        <GoabRadioItem value={"info"} label={"Info"}/>
                        <GoabRadioItem value={"warning"} label={"Warning"}/>
                        <GoabRadioItem value={"critical"} label={"Critical"}/>
                        <GoabRadioItem value={"success"} label={"Success"}/>
                    </GoabRadioGroup>
                </GoabFormItem>
                <GoabFormItem mt={"l"}>
                    <GoabCheckbox name={"isUrgent"} checked={isUrgent} text="Mark as urgent" onChange={(e: GoabCheckboxOnChangeDetail) => setIsUrgent(e.checked)} />
                </GoabFormItem>
                <GoabFormItem label={"Badge Type"} requirement="optional">
                    <GoabDropdown name={"badgeType"} value={badgeType} onChange={(e: GoabDropdownOnChangeDetail) => setBadgeType(e.value as string)}>
                        <GoabDropdownItem value="" label={"None"}></GoabDropdownItem>
                        <GoabDropdownItem value="information" label={"Information"}/>
                        <GoabDropdownItem value="success" label={"Success"}/>
                        <GoabDropdownItem value="important" label={"Important"}/>
                        <GoabDropdownItem value="emergency" label={"Emergency"}/>
                        <GoabDropdownItem value="dark" label={"Dark"}/>
                        <GoabDropdownItem value="midtone" label={"Midtone"}/>
                        <GoabDropdownItem value="light" label={"Light"}/>
                        <GoabDropdownItem value="archived" label={"Archived"}/>
                        <GoabDropdownItem value="aqua" label={"Aqua"}/>
                        <GoabDropdownItem value="black" label={"Black"}/>
                        <GoabDropdownItem value="blue" label={"Blue"}/>
                        <GoabDropdownItem value="green" label={"Green"}/>
                        <GoabDropdownItem value="orange" label={"Orange"}/>
                        <GoabDropdownItem value="pink" label={"Pink"}/>
                        <GoabDropdownItem value="red" label={"Red"}/>
                        <GoabDropdownItem value="violet" label={"Violet"}/>
                        <GoabDropdownItem value="white" label={"White"}/>
                        <GoabDropdownItem value="yellow" label={"Yellow"}/>
                        <GoabDropdownItem value="aqua-light" label={"Aqua Light"}/>
                        <GoabDropdownItem value="black-light" label={"Black Light"}/>
                        <GoabDropdownItem value="blue-light" label={"Blue Light"}/>
                        <GoabDropdownItem value="green-light" label={"Green Light"}/>
                        <GoabDropdownItem value="orange-light" label={"Orange Light"}/>
                        <GoabDropdownItem value="pink-light" label={"Pink Light"}/>
                        <GoabDropdownItem value="red-light" label={"Red Light"}/>
                        <GoabDropdownItem value="violet-light" label={"Violet Light"}/>
                        <GoabDropdownItem value="yellow-light" label={"Yellow Light"}/>
                    </GoabDropdown>
                </GoabFormItem>

                {badgeType?.length > 0 && (
                    <GoabFormItem label={"Badge Content"}>
                        <GoabInput name={"badgeContent"} value={badgeContent} onChange={(e: GoabInputOnChangeDetail) => setBadgeContent(e.value)}/>
                    </GoabFormItem>
                )}
                <GoabButton onClick={submit} mt={"l"}>Add Notification</GoabButton>
            </GoabPageBlock>
        </>
    )
}
