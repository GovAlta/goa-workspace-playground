import React from "react";
import {GoabText, GoabPageBlock, GoabBadge} from "@abgov/react-components";

export function SubMenuItem1Page() {

    return (
        <GoabPageBlock width="content">
            <GoabText tag="h1" size="heading-l" mb="l">
                Documents - Sub Menu Item 1
            </GoabText>
            <GoabText size="body-m">
                Sub menu item 1 content goes here.
            </GoabText>
        </GoabPageBlock>
    );
}
