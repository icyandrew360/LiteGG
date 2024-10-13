class UnauthorizedError(Exception):
    pass


class ForbiddenError(Exception):
    pass


class NotFoundError(Exception):
    pass


class GeneralAPIError(Exception):
    pass


class PatchLoadingError(Exception):
    pass
