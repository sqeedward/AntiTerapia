import streamlit as st
from meme_button import add_meme_button

st.set_page_config(page_title="Meme Launcher", layout="wide")

# Add one or more meme buttons
add_meme_button("😂 Play Cat Laugh", "cat-laugh-meme-1.mp3", "img.jpeg")
