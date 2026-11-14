// SPDX-License-Identifier: MIT OR Apache-2.0
//! Namespace constants. Development builds write to the unpublished `.temp` namespace
//! (see `docs/spec/data-model.md`); the `final-ns` feature switches to the published one.

/// The final, published NSID prefix (authority `pandoras.forum`).
pub const NS_FINAL: &str = "forum.pandoras";

/// The development NSID prefix. Never published; dropped at release 0.1.
pub const NS_TEMP: &str = "forum.pandoras.temp";

/// The prefix this build reads and writes.
#[cfg(feature = "final-ns")]
pub const NS: &str = NS_FINAL;
/// The prefix this build reads and writes.
#[cfg(not(feature = "final-ns"))]
pub const NS: &str = NS_TEMP;

/// Map an NSID authored with the final prefix (as in `lexicons/`) to this build's prefix.
pub fn to_build_nsid(final_nsid: &str) -> Option<String> {
    final_nsid
        .strip_prefix(NS_FINAL)
        .filter(|rest| rest.is_empty() || rest.starts_with('.'))
        .map(|rest| format!("{NS}{rest}"))
}

/// Map an NSID in this build's namespace back to the final prefix used by lexicon files.
pub fn to_final_nsid(build_nsid: &str) -> Option<String> {
    build_nsid
        .strip_prefix(NS)
        .filter(|rest| rest.is_empty() || rest.starts_with('.'))
        .map(|rest| format!("{NS_FINAL}{rest}"))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn roundtrip() {
        let b = to_build_nsid("forum.pandoras.post").unwrap();
        assert_eq!(to_final_nsid(&b).unwrap(), "forum.pandoras.post");
        assert!(to_build_nsid("forum.pandorasx.post").is_none());
    }
}
