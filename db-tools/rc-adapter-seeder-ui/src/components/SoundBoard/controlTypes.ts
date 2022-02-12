export enum IStripControllerTypes {
    Button = 'Button',
    Toggle = 'Toggle',
    Slider = 'Slider',
    Knob = 'Knob',
    Groups = 'Groups',
}

export type IStripController = {
    id: string;
    type: IStripControllerTypes;
    icon?: string;
    iconSize?: number;
    title: string;
    className?: string;
};

export type IStripGroup = {
    id: string;
    title: string;
    description: string;
};
