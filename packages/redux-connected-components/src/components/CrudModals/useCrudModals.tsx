import * as React from 'react';
import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useToggle } from 'react-use';
import { Field } from '../../types/types';
import { DeleteModal, DetailsModal, EditModal, NewModal } from './CrudModals';

type useCrudModalsReturn = [
    JSX.Element,
    {
        onAction: (actionId: string, item: any) => void;
    },
];

export function useCrudModals(fields: Field[], actions: any): useCrudModalsReturn {
    const dispatch = useDispatch();
    const [showNewModal, toggleNewModal] = useToggle(false);
    const [showDetailsModal, toggleDetailsModal] = useToggle(false);
    const [showEditModal, toggleEditModal] = useToggle(false);
    const [showDeleteModal, toggleDeleteModal] = useToggle(false);
    const [currentItem, setCurrentItem] = useState<any>();

    function onAction(actionId: string, item: any) {
        setCurrentItem(item);

        switch (actionId) {
            case 'new':
                toggleNewModal(true);
                break;
            case 'view':
                toggleDetailsModal(true);
                break;
            case 'edit':
                toggleEditModal(true);
                break;
            case 'delete':
                toggleDeleteModal(true);
                break;
            default:
        }
    }

    function onDelete() {
        dispatch(actions.delete(currentItem.id));
    }

    function onAdd(data: any) {
        dispatch(actions.add(data));
    }

    function onEdit(data: any) {
        dispatch(actions.patch(currentItem.id, data));
    }

    const jsx = useMemo(() => {
        return (
            <>
                <DetailsModal show={showDetailsModal} fields={fields} item={currentItem} onClose={toggleDetailsModal} />
                <NewModal show={showNewModal} fields={fields} onSave={onAdd} onClose={toggleNewModal} />
                <EditModal
                    show={showEditModal}
                    fields={fields}
                    onSave={onEdit}
                    item={currentItem}
                    onClose={toggleEditModal}
                />
                <DeleteModal
                    show={showDeleteModal}
                    item={currentItem}
                    onDelete={onDelete}
                    onClose={toggleDeleteModal}
                />
            </>
        );
    }, [
        showDetailsModal,
        showNewModal,
        showEditModal,
        showDeleteModal,
        currentItem,
        toggleDetailsModal,
        toggleNewModal,
        toggleEditModal,
        toggleDeleteModal,
    ]);

    return [jsx, { onAction }];
}
