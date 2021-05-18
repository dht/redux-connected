import * as React from 'react';
import { useRef } from 'react';
import { useToggle } from 'react-use';
import { Field } from '../../types/types';
import Details from '../Details/Details';
import Form, { FormInterface } from '../Form/Form';
import Modal from '../Modal/Modal';
import cssPrefix from '../prefix';

type NewModalProps = {
    onSave: (data: any) => void;
    onClose: () => void;
    fields: Field[];
    show?: boolean;
};

export function NewModal(props: NewModalProps) {
    const { fields, show } = props;
    const ref = useRef<FormInterface>();
    const [loading, toggleIsLoading] = useToggle(false);

    if (!show) {
        return null;
    }

    async function onSave(data: any) {
        toggleIsLoading(true);
        await props.onSave(data);
        toggleIsLoading(false);
        props.onClose();
    }

    const actions = [
        {
            id: 'generate',
            text: 'Generate',
            onClick: () => {
                ref.current?.generate();
            },
        },
        {
            id: 'cancel',
            text: 'Cancel',
            onClick: () => props.onClose(),
        },
        {
            id: 'save',
            text: 'Save',
            isPrimary: true,
            onClick: () => {
                const values = ref.current?.getValues();
                onSave(values);
            },
        },
    ];

    return (
        <Modal
            className={`${cssPrefix}DetailsModal-container`}
            actions={actions}
            title="New Product"
            onClose={props.onClose}
            isLoading={loading}
        >
            <Form fields={fields} item={{}} formRef={ref} saveAllFields={true} autoGenerate={true} />
        </Modal>
    );
}

type EditModalProps = {
    onSave: (data: any) => void;
    onClose: () => void;
    fields: Field[];
    item?: any;
    show?: boolean;
};

export function EditModal(props: EditModalProps) {
    const { fields, item, show } = props;
    const ref = useRef<FormInterface>();
    const [loading, toggleIsLoading] = useToggle(false);

    if (!show) {
        return null;
    }

    async function onSave(data: any) {
        toggleIsLoading(true);
        await props.onSave(data);
        toggleIsLoading(false);
        props.onClose();
    }

    const actions = [
        {
            id: 'close',
            text: 'Close',
            onClick: () => props.onClose(),
        },
        {
            id: 'save',
            text: 'Save',
            isPrimary: true,
            onClick: () => {
                const values = ref.current?.getValues();
                onSave(values);
            },
        },
    ];

    return (
        <Modal
            className={`${cssPrefix}EditModal-container`}
            actions={actions}
            title="Details"
            onClose={props.onClose}
            isLoading={loading}
        >
            <Form fields={fields} item={item} formRef={ref}></Form>
        </Modal>
    );
}

type DetailsModalProps = {
    onClose: () => void;
    fields: Field[];
    item?: any;
    show?: boolean;
};

export function DetailsModal(props: DetailsModalProps) {
    const { fields, item, show } = props;

    if (!show) {
        return null;
    }

    const actions = [
        {
            id: 'close',
            text: 'Close',
            isPrimary: true,
            onClick: () => props.onClose(),
        },
    ];

    return (
        <Modal
            className={`${cssPrefix}DetailsModal-container`}
            actions={actions}
            title="Details"
            onClose={props.onClose}
        >
            <Details fields={fields} item={item}></Details>
        </Modal>
    );
}

type DeleteModalProps = {
    onClose: () => void;
    onDelete: () => void;
    item?: any;
    show?: boolean;
};

export function DeleteModal(props: DeleteModalProps) {
    const { show } = props;
    const [isLoading, toggleIsLoading] = useToggle(false);

    if (!show) {
        return null;
    }

    const onDelete = async () => {
        toggleIsLoading(true);
        await props.onDelete();
        toggleIsLoading(false);
        props.onClose();
    };

    const actions = [
        {
            id: 'cancel',
            text: 'Cancel',
            onClick: () => props.onClose(),
        },
        {
            id: 'delete',
            text: 'Delete',
            isPrimary: true,
            onClick: () => onDelete(),
        },
    ];

    return (
        <Modal
            className={`${cssPrefix}DeleteModal-container`}
            actions={actions}
            title="Confirm"
            onClose={props.onClose}
            isLoading={isLoading}
        >
            <div>Are you sure you want to delete?</div>
        </Modal>
    );
}
