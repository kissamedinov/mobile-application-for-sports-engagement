from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import init_db

from .database import init_db
from .routers import auth as auth_router
from .routers import users as users_router
from .routers import matches as matches_router
from .routers import notifications as notifications_router

app = FastAPI(title="Sports Match Management MVP")

# CORS for frontend deva
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # TODO: adjust in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    init_db()



app.include_router(auth_router.router)
app.include_router(users_router.router)
app.include_router(matches_router.router)
app.include_router(notifications_router.router)