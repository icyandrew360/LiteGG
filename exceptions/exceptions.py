class UnauthorizedError(Exception):
    pass


class ForbiddenError(Exception):
    pass


class NotFoundError(Exception):
    pass


class GeneralAPIError(Exception):
    pass


class ChampionLoadingError(Exception):
    pass
