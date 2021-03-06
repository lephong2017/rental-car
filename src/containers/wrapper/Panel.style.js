import styled from 'styled-components';
import WithDirection from 'settings/withDirection';

const PanelWrapper = styled.div`
    width: 100%;
    height:100%;
    background-color:#fafafa;
    .panel__header{
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size:1.5rem;
        font-weight:400;
    }
    &.full-screen-mode{
        position:fixed;
        height:100%;
        width:100%;
        z-index:1000;
        top:0;
        left:0;
        overflow:hidden;
        .form-header{
            position:fixed;
            top:0;
            left:0;
            width:100%;
            padding: 15px 30px;
            background:white;
            z-index:1010;
            border-bottom:1px solid rgba(0,0,0,0.12);
        }
    }
`;

export default WithDirection(PanelWrapper);
