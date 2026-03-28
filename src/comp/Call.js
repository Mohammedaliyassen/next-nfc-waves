import { ICON_ASSETS } from '../lib/assets';
function Call(props) {
    const { telNo, editMode = false, editData, func } = props
    return (
        <>
            {editMode ?
                <span className="call" id='whatsapp' >
                    <img src={ICON_ASSETS.phone.src} alt='whatsapp' />
                    <input
                        type="tel"
                        name="phone"
                        className="callInput"
                        placeholder="رقم الهاتف الأساسي"
                        value={editData}
                        onChange={func}
                    />
                </span>
                :
                <a href={`tel:${telNo}`}>
                    <span className="call" id='whatsapp'>
                        <img src={ICON_ASSETS.phone.src} alt='whatsapp' />
                        <p> : <a href={`tel:${telNo}`}>{telNo}</a></p>
                    </span>
                </a>
            }
        </>
    );
}

export default Call;
