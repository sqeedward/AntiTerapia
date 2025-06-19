import streamlit as st
import base64
import time

def _load_file_base64(path):
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode()

def add_meme_button(label: str, sound_file: str, image_file: str):
    key_prefix = f"meme_{label.replace(' ', '_')}"
    overlay_flag_key = f"{key_prefix}_show"

    if overlay_flag_key not in st.session_state:
        st.session_state[overlay_flag_key] = False

    # Load audio and image
    img_data = _load_file_base64(image_file)
    sound_data = _load_file_base64(sound_file)

    # Inject CSS (only once)
    st.markdown(f"""
        <style>
        .centered-button {{
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }}
        .intro-overlay {{
            position: fixed;
            top: 0; left: 0;
            width: 100vw;
            height: 100vh;
            background-color: black;
            z-index: 9999;
            animation: fadeOut 3s forwards;
        }}
        .intro-overlay img {{
            width: 100vw;
            height: 100vh;
            object-fit: cover;
        }}
        @keyframes fadeOut {{
            0% {{ opacity: 1; }}
            100% {{ opacity: 0; visibility: hidden; }}
        }}
        </style>
    """, unsafe_allow_html=True)

    # Button
    st.markdown('<div class="centered-button">', unsafe_allow_html=True)
    if st.button(label, key=key_prefix):
        st.session_state[overlay_flag_key] = True
        st.rerun()
    st.markdown('</div>', unsafe_allow_html=True)

    # Overlay and audio
    if st.session_state[overlay_flag_key]:
        st.markdown(f"""
            <div class="intro-overlay">
                <img src="data:image/jpeg;base64,{img_data}" />
            </div>
            <audio autoplay>
                <source src="data:audio/mp3;base64,{sound_data}" type="audio/mp3">
            </audio>
        """, unsafe_allow_html=True)

        time.sleep(3.1)
        st.session_state[overlay_flag_key] = False
        st.rerun()
