# Add missing import for create_engine
from sqlalchemy import create_engine


import sys
import os
sys.path.append(r"c:\Users\NeerajAgnihotri\it_delivery_dashboard\zap-it-delivery-dashboard\backend\src")

import logging
from logging.config import fileConfig

from flask import current_app

from alembic import context
from src.domain.models.base import Base


# Alembic Config object
config = context.config

# Set up loggers
fileConfig(config.config_file_name)
logger = logging.getLogger('alembic.env')

# Import Base from correct location
from src.domain.models.base import Base
target_metadata = Base.metadata
url = config.get_main_option("sqlalchemy.url")

def run_migrations_offline():
    context.configure(
        url=url, target_metadata=target_metadata, literal_binds=True
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    connectable = create_engine(url)
    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

