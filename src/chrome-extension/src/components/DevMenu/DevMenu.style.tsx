import styled from 'styled-components';

export const Container = styled.div`
    width: 220px;
    border-right: 1px solid rgba(255, 255, 255, 0.2);
`;

export const MenuGroup = styled.div`
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

export const MenuGroupTitle = styled.div`
    font-size: 13px;
    padding: 5px 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    background-color: rgba(0, 0, 0, 0.1);
`;

export const MenuItem = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 5px 10px;

    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
        cursor: pointer;
    }
`;

export const Title = styled.div`
    flex: 1;
`;

export const Badge = styled.div`
    background-color: rgba(255, 255, 255, 0.2);
    padding: 2px 10px;
    font-size: 13px;
    border-radius: 7px;
`;
